import dayjs from 'dayjs';
import { pool } from '../../../../lib/postgres/connection.js';

export default async (request, response) => {
  const today = dayjs().format('YYYY-MM-DD');
  const todayStart = `${today} 00:00:00`;
  const todayEnd = `${today} 23:59:59`;

  const [ordersResult, customersResult] = await Promise.all([
    pool.query(
      `SELECT
         COUNT(order_id) AS total_orders,
         COALESCE(SUM(grand_total), 0) AS total_revenue
       FROM "order"
       WHERE created_at >= $1
         AND created_at <= $2`,
      [todayStart, todayEnd]
    ),
    pool.query(
      `SELECT COUNT(customer_id) AS new_customers
       FROM customer
       WHERE created_at >= $1
         AND created_at <= $2`,
      [todayStart, todayEnd]
    )
  ]);

  const orderRow = ordersResult.rows[0];
  const customerRow = customersResult.rows[0];

  response.json({
    totalOrders: parseInt(orderRow.total_orders, 10) || 0,
    totalRevenue: parseFloat(orderRow.total_revenue) || 0,
    newCustomers: parseInt(customerRow.new_customers, 10) || 0
  });
};
