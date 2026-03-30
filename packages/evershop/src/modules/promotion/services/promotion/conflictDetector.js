import { getActivePromotions } from './getActivePromotions.js';
import { validatePromotion } from './promotionValidator.js';

/**
 * Detects conflicts between active promotions and between promotions and active coupons.
 * @param {Object|null} cart - Optional cart object to validate promotions against
 * @returns {Promise<Array>} Array of conflict objects: {type, promotionIds, message}
 */
export async function detectConflicts(cart = null) {
  const allPromotions = await getActivePromotions();
  const conflicts = [];

  // Optionally filter to promotions valid for this cart
  const promotions = cart
    ? allPromotions.filter((p) => validatePromotion(cart, p))
    : allPromotions;

  const couponCode = cart ? cart.getData('coupon') : null;

  for (let i = 0; i < promotions.length; i++) {
    const p1 = promotions[i];

    // Check promotion vs coupon conflict
    if (couponCode && !p1.stackable_with_coupons) {
      conflicts.push({
        type: 'promotion_coupon',
        promotionIds: [p1.promotion_id],
        message: `Promotion "${p1.name}" (ID: ${p1.promotion_id}) cannot be combined with coupon "${couponCode}"`
      });
    }

    // Check promotion vs promotion conflicts
    for (let j = i + 1; j < promotions.length; j++) {
      const p2 = promotions[j];
      if (!p1.stackable_with_promotions || !p2.stackable_with_promotions) {
        conflicts.push({
          type: 'promotion_promotion',
          promotionIds: [p1.promotion_id, p2.promotion_id],
          message: `Promotions "${p1.name}" and "${p2.name}" cannot be combined — at least one is non-stackable with other promotions`
        });
      }
    }
  }

  return conflicts;
}
