import {
  commit,
  rollback,
  select,
  startTransaction,
  update
} from '@evershop/postgres-query-builder';
import { getConnection } from '../../../../lib/postgres/connection.js';
import { hookable } from '../../../../lib/util/hookable.js';
import { getValue, getValueSync } from '../../../../lib/util/registry.js';
import { getAjv } from '../../../base/services/getAjv.js';
import promotionDataSchema from './promotionDataSchema.json' with { type: 'json' };

function validatePromotionDataBeforeUpdate(data) {
  const ajv = getAjv();
  const schema = { ...promotionDataSchema };
  schema.required = [];
  const jsonSchema = getValueSync('updatePromotionDataJsonSchema', schema);
  const validate = ajv.compile(jsonSchema);
  const valid = validate(data);
  if (valid) {
    return data;
  } else {
    throw new Error(validate.errors[0].message);
  }
}

async function updatePromotionData(uuid, data, connection) {
  const promotion = await select()
    .from('promotion')
    .where('uuid', '=', uuid)
    .load(connection);

  if (!promotion) {
    throw new Error('Requested promotion not found');
  }

  try {
    const newPromotion = await update('promotion')
      .given(data)
      .where('uuid', '=', uuid)
      .execute(connection);
    return newPromotion;
  } catch (e) {
    if (!e.message.includes('No data was provided')) {
      throw e;
    } else {
      return promotion;
    }
  }
}

async function updatePromotion(uuid, data, context) {
  const connection = await getConnection();
  await startTransaction(connection);
  try {
    const promotionData = await getValue('promotionDataBeforeUpdate', data);
    validatePromotionDataBeforeUpdate(promotionData);
    const promotion = await hookable(updatePromotionData, { ...context, connection })(
      uuid,
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

export default async (uuid, data, context) => {
  if (context && typeof context !== 'object') {
    throw new Error('Context must be an object');
  }
  const promotion = await hookable(updatePromotion, context)(uuid, data, context);
  return promotion;
};
