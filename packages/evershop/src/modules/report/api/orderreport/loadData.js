import { select } from '@evershop/postgres-query-builder';
import dayjs from 'dayjs';
import { pool } from '../../../../lib/postgres/connection.js';

export default async (request, response) => {
  const { period = 'last7days' } = request.query;
  const today = dayjs().format('YYYY-MM-DD');
  const slots = [];

  if (period === 'today') {
    for (let h = 0; h < 24; h++) {
      const hh = String(h).padStart(2, '0');
      slots.push({
        from: `${today} ${hh}:00:00`,
        to: `${today} ${hh}:59:59`,
        time: `${hh}:00`
      });
    }
  } else if (period === 'last7days') {
    for (let d = 6; d >= 0; d--) {
      const day = dayjs(today).subtract(d, 'day').format('YYYY-MM-DD');
      slots.push({
        from: `${day} 00:00:00`,
        to: `${day} 23:59:59`,
        time: dayjs(today).subtract(d, 'day').format('MMM DD')
      });
    }
  } else if (period === 'last30days') {
    for (let d = 29; d >= 0; d--) {
      const day = dayjs(today).subtract(d, 'day').format('YYYY-MM-DD');
      slots.push({
        from: `${day} 00:00:00`,
        to: `${day} 23:59:59`,
        time: dayjs(today).subtract(d, 'day').format('MMM DD')
      });
    }
  }

  const results = await Promise.all(
    slots.map(async (slot) => {
      const query = select();
      query
        .from('order')
        .select('COUNT(order_id)', 'count')
        .where('created_at', '>=', slot.from)
        .and('created_at', '<=', slot.to);
      query.limit(0, 1);
      const queryResult = await query.execute(pool);
      return {
        count: parseInt(queryResult[0].count, 10) || 0,
        time: slot.time
      };
    })
  );

  response.json(results);
};