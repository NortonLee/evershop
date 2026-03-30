import { execute } from '@evershop/postgres-query-builder';

export default async (connection) => {
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS "promotion" (
  "promotion_id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" VARCHAR NOT NULL,
  "description" TEXT DEFAULT NULL,
  "status" BOOLEAN NOT NULL DEFAULT TRUE,
  "type" VARCHAR NOT NULL,
  "discount_type" VARCHAR NOT NULL DEFAULT 'percentage',
  "discount_amount" DECIMAL(12,4) NOT NULL DEFAULT 0,
  "min_purchase_amount" DECIMAL(12,4) DEFAULT NULL,
  "target_products" JSONB DEFAULT NULL,
  "buy_qty" INT DEFAULT NULL,
  "get_qty" INT DEFAULT NULL,
  "get_discount" DECIMAL(12,4) DEFAULT NULL,
  "max_discount_amount" DECIMAL(12,4) DEFAULT NULL,
  "priority" INT NOT NULL DEFAULT 0,
  "stackable_with_coupons" BOOLEAN NOT NULL DEFAULT TRUE,
  "stackable_with_promotions" BOOLEAN NOT NULL DEFAULT FALSE,
  "start_date" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  "end_date" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PROMOTION_UUID_UNIQUE" UNIQUE ("uuid"),
  CONSTRAINT "POSITIVE_DISCOUNT" CHECK(discount_amount >= 0),
  CONSTRAINT "VALID_PERCENTAGE" CHECK(discount_amount <= 100 OR discount_type != 'percentage')
)`
  );
};
