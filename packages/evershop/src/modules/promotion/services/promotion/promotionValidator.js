import { DateTime } from 'luxon';

/**
 * Validate if a promotion applies to the given cart.
 * Checks status, date range, min_purchase_amount, and type-specific rules.
 * @param {Object} cart - Cart object
 * @param {Object} promotion - Promotion record from DB
 * @returns {boolean} true if promotion is valid for this cart
 */
export function validatePromotion(cart, promotion) {
  // Status check
  if (!promotion.status) {
    return false;
  }

  // Date range check
  const nowDt = DateTime.utc();
  if (promotion.start_date) {
    const startDate = DateTime.fromJSDate(new Date(promotion.start_date), { zone: 'UTC' });
    if (startDate > nowDt) {
      return false;
    }
  }
  if (promotion.end_date) {
    const endDate = DateTime.fromJSDate(new Date(promotion.end_date), { zone: 'UTC' });
    if (endDate < nowDt) {
      return false;
    }
  }

  // limited_time type MUST have both start_date and end_date
  if (promotion.type === 'limited_time') {
    if (!promotion.start_date || !promotion.end_date) {
      return false;
    }
  }

  // Min purchase amount check
  if (promotion.min_purchase_amount !== null && promotion.min_purchase_amount !== undefined) {
    const subTotal = parseFloat(cart.getData('sub_total') || 0);
    if (subTotal < parseFloat(promotion.min_purchase_amount)) {
      return false;
    }
  }

  return true;
}
