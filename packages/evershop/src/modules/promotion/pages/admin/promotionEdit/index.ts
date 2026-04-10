import { select } from '@evershop/postgres-query-builder';
import { pool } from '../../../../../lib/postgres/connection.js';
import { buildUrl } from '../../../../../lib/router/buildUrl.js';
import { EvershopResponse } from '../../../../../types/response.js';
import { setPageMetaInfo } from '../../../../cms/services/pageMetaInfo.js';
import { setContextValue } from '../../../../graphql/services/contextHelper.js';

export default async (request, response: EvershopResponse, next) => {
  try {
    const query = select();
    query.from('promotion');
    query.andWhere('promotion.uuid', '=', request.params.id);
    const promotion = await query.load(pool);

    if (promotion === null) {
      response.redirect(302, buildUrl('promotionGrid'));
    } else {
      setContextValue(request, 'promotionId', parseInt(promotion.promotion_id, 10));
      setContextValue(request, 'promotionUuid', promotion.uuid);
      setPageMetaInfo(request, {
        title: promotion.name,
        description: promotion.name
      });
      next();
    }
  } catch (e) {
    next(e);
  }
};
