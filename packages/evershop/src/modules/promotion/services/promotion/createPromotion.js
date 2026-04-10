import {
  commit,
  insert,
  rollback,
  startTransaction
} from '@evershop/postgres-query-builder';
import { getConnection } from '../../../../lib/postgres/connection.js';
import { hookable } from '../../../../lib/util/hookable.js';
import { getValue, getValueSync } from '../../../../lib/util/registry.js';
import { getAjv } from '../../../base/services/getAjv.js';
import promotionDataSchema from './promotionDataSchema.json' with { type: 'json' };

function validatePromotionDataBeforeInsert(data) {
  const ajv = getAjv();
  const schema = { ...promotionDataSchema };
  schema.required = ['name', 'status', 'type', 'discount_type', 'discount_amount'];
  const jsonSchema = getValueSync('createPromotionDataJsonSchema', schema);
  const validate = ajv.compile(jsonSchema);
  const valid = validate(data);
  if (valid) {
    return data;
  } else {
    throw new Error(validate.errors[0].message);
  }
}

async function insertPromotionData(data, connection) {
  const promotion = await insert('promotion').given(data).execute(connection);
  return promotion;
}

async function createPromotion(data, context) {
  const connection = await getConnection();
  await startTransaction(connection);
  try {
    const promotionData = await getValue('promotionDataBeforeCreate', data);
    validatePromotionDataBeforeInsert(promotionData);
    const promotion = await hookable(insertPromotionData, { ...context, connection })(
      promotionData,
      connection
    );
    await commit(connection);
    return promotion;
  } catch (e) {
    await rollback(connection);
    throw e;
  }
}

export default async (data, context) => {
  if (context && typeof context !== 'object') {
    throw new Error('Context must be an object');
  }
  const promotion = await hookable(createPromotion, context)(data, context);
  return promotion;
};
