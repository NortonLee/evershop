import updatePromotion from '../../services/promotion/updatePromotion.js';

export default async (request, response) => {
  const promotion = await updatePromotion(request.params.id, request.body, {
    routeId: request.currentRoute.id
  });
  return promotion;
};
