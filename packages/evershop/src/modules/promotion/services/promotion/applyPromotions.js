import { info } from '../../../../lib/log/logger.js';
import { toPrice } from '../../../checkout/services/toPrice.js';
import { getActivePromotions } from './getActivePromotions.js';
import { calculatePromotionDiscount } from './promotionCalculator.js';
import { validatePromotion } from './promotionValidator.js';

/**
 * Detects conflicts between promotions and between promotions and active coupons.
 * @param {Array} validPromotions - Array of validated promotions
 * @param {string|null} couponCode - Active coupon code on the cart (if any)
 * @returns {Array} Array of conflict objects
 */
function detectConflicts(validPromotions, couponCode) {
  const conflicts = [];

  for (let i = 0; i < validPromotions.length; i++) {
    const p1 = validPromotions[i];

    // Check promotion vs coupon conflict
    if (couponCode && !p1.stackable_with_coupons) {
      conflicts.push({
        type: 'promotion_coupon',
        promotionIds: [p1.promotion_id],
        message: `Promotion "${p1.name}" cannot be combined with coupon "${couponCode}"`
      });
    }

    // Check promotion vs promotion conflicts
    for (let j = i + 1; j < validPromotions.length; j++) {
      const p2 = validPromotions[j];
      if (!p1.stackable_with_promotions || !p2.stackable_with_promotions) {
        conflicts.push({
          type: 'promotion_promotion',
          promotionIds: [p1.promotion_id, p2.promotion_id],
          message: `Promotions "${p1.name}" and "${p2.name}" cannot be combined`
        });
      }
    }
  }

  return conflicts;
}

/**
 * Orchestrates promotion application:
 * 1. Load active promotions
 * 2. Validate each against the cart
 * 3. Handle conflicts (highest priority wins if non-stackable)
 * 4. Calculate and apply discounts
 * @param {Object} cart - Cart object
 * @returns {number} Total promotion discount amount
 */
export async function applyPromotions(cart) {
  try {
    const allPromotions = await getActivePromotions();
    if (!allPromotions || allPromotions.length === 0) {
      return 0;
    }

    // Validate each promotion against the cart
    const validPromotions = allPromotions.filter((promo) =>
      validatePromotion(cart, promo)
    );

    if (validPromotions.length === 0) {
      return 0;
    }

    // Sort by priority descending (higher priority first)
    validPromotions.sort((a, b) => parseInt(b.priority, 10) - parseInt(a.priority, 10));

    const couponCode = cart.getData('coupon');

    // Resolve conflicts: if a promotion is non-stackable with promotions,
    // only the highest priority one applies (already sorted)
    const appliedPromotions = [];
    let hasNonStackable = false;

    for (const promo of validPromotions) {
      if (!promo.stackable_with_promotions) {
        if (!hasNonStackable) {
          // Check if this conflicts with coupon
          if (couponCode && !promo.stackable_with_coupons) {
            // Coupon takes precedence if it was already set; skip this promotion
            continue;
          }
          appliedPromotions.push(promo);
          hasNonStackable = true;
        }
        // Skip additional non-stackable promotions
      } else {
        // Stackable with other promotions
        if (couponCode && !promo.stackable_with_coupons) {
          // Skip promotion that conflicts with active coupon
          continue;
        }
        appliedPromotions.push(promo);
      }
    }

    // Calculate discounts for each applied promotion
    let totalPromotionDiscount = 0;
    for (const promo of appliedPromotions) {
      const discount = await calculatePromotionDiscount(cart, promo);
      totalPromotionDiscount += discount;
    }

    return toPrice(totalPromotionDiscount);
  } catch (e) {
    info(`Error applying promotions: ${e.message}`);
    return 0;
  }
}
