import { toPrice } from '../../../checkout/services/toPrice.js';

/**
 * Calculate the discount for a given promotion type.
 * Mutates cart item discount_amount fields.
 * @param {Object} cart - Cart object
 * @param {Object} promotion - Promotion record
 * @returns {number} Total discount amount
 */
export async function calculatePromotionDiscount(cart, promotion) {
  const items = cart.getItems();
  let totalDiscount = 0;

  switch (promotion.type) {
    case 'spend_and_save':
    case 'limited_time': {
      // Apply discount to entire cart
      const subTotal = parseFloat(cart.getData('sub_total') || 0);
      let discount = 0;
      if (promotion.discount_type === 'percentage') {
        discount = toPrice(subTotal * (parseFloat(promotion.discount_amount) / 100));
      } else {
        discount = toPrice(parseFloat(promotion.discount_amount));
      }
      // Cap discount if max_discount_amount is set
      if (promotion.max_discount_amount !== null && promotion.max_discount_amount !== undefined) {
        discount = Math.min(discount, parseFloat(promotion.max_discount_amount));
      }
      // Distribute discount proportionally across items
      if (subTotal > 0 && items.length > 0) {
        let remaining = discount;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const itemSubTotal = toPrice(
            parseFloat(item.getData('final_price') || 0) * parseInt(item.getData('qty') || 1, 10)
          );
          let itemDiscount;
          if (i === items.length - 1) {
            itemDiscount = remaining;
          } else {
            itemDiscount = toPrice((itemSubTotal / subTotal) * discount);
            remaining -= itemDiscount;
          }
          const existing = parseFloat(item.getData('discount_amount') || 0);
          item.setData('discount_amount', toPrice(existing + itemDiscount));
        }
      }
      totalDiscount = discount;
      break;
    }

    case 'bogo': {
      // BOGO: For each buy_qty items matching target_products, next get_qty items get get_discount% off
      const buyQty = parseInt(promotion.buy_qty || 1, 10);
      const getQty = parseInt(promotion.get_qty || 1, 10);
      const getDiscountPct = parseFloat(promotion.get_discount || 100);

      // Get eligible items (matching target products if specified)
      let eligibleItems = items;
      if (
        promotion.target_products &&
        Array.isArray(promotion.target_products) &&
        promotion.target_products.length > 0
      ) {
        const targetSkus = promotion.target_products
          .map((p) => p.sku || p.product_sku)
          .filter(Boolean);
        const targetIds = promotion.target_products
          .map((p) => parseInt(p.product_id, 10))
          .filter(Boolean);
        if (targetSkus.length > 0 || targetIds.length > 0) {
          eligibleItems = items.filter(
            (item) =>
              targetSkus.includes(item.getData('product_sku')) ||
              targetIds.includes(parseInt(item.getData('product_id'), 10))
          );
        }
      }

      // Expand items into individual units for BOGO calculation (sorted by price asc, cheapest get discount)
      const unitItems = [];
      for (const item of eligibleItems) {
        const qty = parseInt(item.getData('qty') || 1, 10);
        const price = parseFloat(item.getData('final_price') || 0);
        for (let u = 0; u < qty; u++) {
          unitItems.push({ item, price });
        }
      }
      // Sort ascending: lowest-price units get the discount
      unitItems.sort((a, b) => a.price - b.price);

      const itemDiscounts = new Map();
      const cycleSize = buyQty + getQty;

      for (let i = 0; i < unitItems.length; i++) {
        const posInCycle = i % cycleSize;
        if (posInCycle >= buyQty) {
          const { item, price } = unitItems[i];
          const unitDiscount = toPrice(price * getDiscountPct / 100);
          itemDiscounts.set(item, (itemDiscounts.get(item) || 0) + unitDiscount);
        }
      }

      // Apply accumulated discounts to items
      for (const [item, discount] of itemDiscounts) {
        let finalDiscount = discount;
        if (
          promotion.max_discount_amount !== null &&
          promotion.max_discount_amount !== undefined
        ) {
          finalDiscount = Math.min(finalDiscount, parseFloat(promotion.max_discount_amount));
        }
        const existing = parseFloat(item.getData('discount_amount') || 0);
        item.setData('discount_amount', toPrice(existing + finalDiscount));
        totalDiscount += finalDiscount;
      }
      break;
    }

    default:
      break;
  }

  return toPrice(totalDiscount);
}
