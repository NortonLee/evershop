import { execute } from '@evershop/postgres-query-builder';

export default async (connection) => {
  await execute(
    connection,
    `ALTER TABLE "coupon"
     ADD COLUMN IF NOT EXISTS "stackable" BOOLEAN NOT NULL DEFAULT FALSE,
     ADD COLUMN IF NOT EXISTS "max_uses_per_order" INT DEFAULT NULL,
     ADD COLUMN IF NOT EXISTS "min_order_amount" DECIMAL(12,4) DEFAULT NULL`
  );
};
