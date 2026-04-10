import {
  commit,
  del,
  rollback,
  select,
  startTransaction
} from '@evershop/postgres-query-builder';
import { getConnection } from '../../../../lib/postgres/connection.js';
import { hookable } from '../../../../lib/util/hookable.js';

async function deletePromotionData(uuid, connection) {
  await del('promotion').where('uuid', '=', uuid).execute(connection);
}

async function deletePromotion(uuid, context) {
  const connection = await getConnection();
  await startTransaction(connection);
  try {
    const promotion = await select()
      .from('promotion')
      .where('uuid', '=', uuid)
      .load(connection);

    if (!promotion) {
      throw new Error('Invalid promotion id');
    }
    await hookable(deletePromotionData, { ...context, promotion, connection })(
      uuid,
      connection
    );
    await commit(connection);
    return promotion;
  } catch (e) {
    await rollback(connection);
    throw e;
  }
}

export default async (uuid, context) => {
  if (context && typeof context !== 'object') {
    throw new Error('Context must be an object');
  }
  const promotion = await hookable(deletePromotion, context)(uuid, context);
  return promotion;
};
