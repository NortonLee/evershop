import { toPrice } from '../../checkout/services/toPrice.js';
import { applyPromotions } from './promotion/applyPromotions.js';

/**
 * Registers cart fields for the automatic promotions system.
 * Adds a `promotion_discount_amount` field to the cart that is calculated
 * by running all active promotions against the cart.
 */
export function registerPromotionCartFields(fields) {
  return fields.concat([
    {
      key: 'promotion_discount_amount',
      resolvers: [
        async function resolver() {
          // Reset item promotion discounts before recalculating
          const items = this.getItems();
          for (const item of items) {
            // Store coupon discount amount separately so we don't overwrite it
            const couponDiscount = parseFloat(item.getData('discount_amount') || 0);
            item.setData('_coupon_discount_amount', couponDiscount);
            item.setData('discount_amount', 0);
          }

          const promotionDiscount = await applyPromotions(this);

          // Restore coupon discounts (add on top of promotion discounts)
          for (const item of items) {
            const couponDiscount = parseFloat(item.getData('_coupon_discount_amount') || 0);
            const promotionItemDiscount = parseFloat(item.getData('discount_amount') || 0);
            item.setData('discount_amount', toPrice(couponDiscount + promotionItemDiscount));
          }

          return toPrice(promotionDiscount);
        }
      ],
      dependencies: ['discount_amount', 'coupon', 'sub_total']
    }
  ]);
}
