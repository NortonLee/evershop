import { INTERNAL_SERVER_ERROR, OK } from '../../../../lib/util/httpStatus.js';
import deletePromotion from '../../services/promotion/deletePromotion.js';

export default async (request, response, next) => {
  try {
    const { id } = request.params;
    const promotion = await deletePromotion(id, {
      routeId: request.currentRoute.id
    });
    response.status(OK);
    response.json({
      data: promotion
    });
  } catch (e) {
    response.status(INTERNAL_SERVER_ERROR);
    response.json({
      error: {
        status: INTERNAL_SERVER_ERROR,
        message: e.message
      }
    });
  }
};
