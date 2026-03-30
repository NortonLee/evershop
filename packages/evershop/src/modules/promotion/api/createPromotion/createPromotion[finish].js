import createPromotion from '../../services/promotion/createPromotion.js';

export default async (request, response) => {
  const promotion = await createPromotion(request.body, {
    routeId: request.currentRoute.id
  });
  return promotion;
};
