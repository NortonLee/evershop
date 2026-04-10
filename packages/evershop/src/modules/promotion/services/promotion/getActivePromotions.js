import { select } from '@evershop/postgres-query-builder';
import { pool } from '../../../../lib/postgres/connection.js';
import { DateTime } from 'luxon';

/**
 * Load all active promotions that apply to the current date.
 * @returns {Promise<Array>} Array of active promotion objects
 */
export async function getActivePromotions() {
  const results = await select()
    .from('promotion')
    .where('status', '=', true)
    .execute(pool);

  if (!results || results.length === 0) {
    return [];
  }

  const nowDt = DateTime.utc();
  return results.filter((promo) => {
    const startOk =
      !promo.start_date ||
      DateTime.fromJSDate(new Date(promo.start_date), { zone: 'UTC' }) <= nowDt;
    const endOk =
      !promo.end_date ||
      DateTime.fromJSDate(new Date(promo.end_date), { zone: 'UTC' }) >= nowDt;
    return startOk && endOk;
  });
}
