import { execute } from '@evershop/postgres-query-builder';

export default async (connection) => {
  // Add wechat column to customer_address table
  await execute(
    connection,
    `ALTER TABLE customer_address ADD COLUMN IF NOT EXISTS "wechat" varchar DEFAULT NULL`
  );
};
