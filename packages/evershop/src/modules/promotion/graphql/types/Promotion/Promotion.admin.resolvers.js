import { select } from '@evershop/postgres-query-builder';
import { GraphQLJSON } from 'graphql-type-json';
import { buildUrl } from '../../../../../lib/router/buildUrl.js';
import { camelCase } from '../../../../../lib/util/camelCase.js';
import { detectConflicts } from '../../../services/promotion/conflictDetector.js';
import createPromotionService from '../../../services/promotion/createPromotion.js';
import deletePromotionService from '../../../services/promotion/deletePromotion.js';
import updatePromotionService from '../../../services/promotion/updatePromotion.js';

const PROMOTION_FIELDS = [
  'promotion_id',
  'uuid',
  'name',
  'description',
  'status',
  'type',
  'discount_type',
  'discount_amount',
  'min_purchase_amount',
  'target_products',
  'buy_qty',
  'get_qty',
  'get_discount',
  'max_discount_amount',
  'priority',
  'stackable_with_coupons',
  'stackable_with_promotions',
  'start_date',
  'end_date',
  'created_at',
  'updated_at'
];

function mapPromotion(promo) {
  if (!promo) return null;
  const mapped = camelCase(promo);
  return {
    ...mapped,
    status: mapped.status ? 1 : 0,
    stackableWithCoupons: mapped.stackableWithCoupons ? 1 : 0,
    stackableWithPromotions: mapped.stackableWithPromotions ? 1 : 0
  };
}

export default {
  JSON: GraphQLJSON,
  Query: {
    promotion: async (root, { id }, { pool }) => {
      if (!id) return null;
      const promo = await select()
        .from('promotion')
        .where('promotion_id', '=', id)
        .load(pool);
      return mapPromotion(promo);
    },

    promotions: async (_, { filters = [] }, { pool, user }) => {
      if (!user) {
        return { items: [], currentPage: 1, total: 0, currentFilters: [] };
      }

      const query = select().from('promotion');

      // Apply simple filters
      let page = 1;
      let limit = 20;
      const validFilters = [];

      for (const filter of filters) {
        if (filter.key === 'page') {
          page = parseInt(filter.value, 10) || 1;
          validFilters.push(filter);
        } else if (filter.key === 'limit') {
          limit = parseInt(filter.value, 10) || 20;
          validFilters.push(filter);
        } else if (filter.key === 'name') {
          query.andWhere('name', 'ILIKE', `%${filter.value}%`);
          validFilters.push(filter);
        } else if (filter.key === 'status') {
          query.andWhere('status', '=', filter.value === '1');
          validFilters.push(filter);
        } else if (filter.key === 'type') {
          query.andWhere('type', '=', filter.value);
          validFilters.push(filter);
        }
      }

      const countQuery = select('COUNT(*)', 'total').from('promotion');
      // Apply same filters to count query
      for (const filter of filters) {
        if (filter.key === 'name') {
          countQuery.andWhere('name', 'ILIKE', `%${filter.value}%`);
        } else if (filter.key === 'status') {
          countQuery.andWhere('status', '=', filter.value === '1');
        } else if (filter.key === 'type') {
          countQuery.andWhere('type', '=', filter.value);
        }
      }

      const countResult = await countQuery.load(pool);
      const total = parseInt((countResult && countResult.total) || 0, 10);

      query.limit(limit).offset((page - 1) * limit);
      query.orderBy('priority', 'DESC');

      const items = await query.execute(pool);

      return {
        items: (items || []).map(mapPromotion),
        currentPage: page,
        total,
        currentFilters: validFilters
      };
    },

    promotionConflicts: async (_, __, { pool }) => {
      try {
        const conflicts = await detectConflicts(null);
        return conflicts;
      } catch (e) {
        return [];
      }
    }
  },

  Mutation: {
    createPromotion: async (root, { input }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      const data = {
        name: input.name,
        description: input.description || null,
        status: input.status === 1 || input.status === true,
        type: input.type,
        discount_type: input.discountType,
        discount_amount: input.discountAmount,
        min_purchase_amount: input.minPurchaseAmount ?? null,
        target_products: input.targetProducts ?? null,
        buy_qty: input.buyQty ?? null,
        get_qty: input.getQty ?? null,
        get_discount: input.getDiscount ?? null,
        max_discount_amount: input.maxDiscountAmount ?? null,
        priority: input.priority ?? 0,
        stackable_with_coupons: input.stackableWithCoupons !== 0,
        stackable_with_promotions: input.stackableWithPromotions === 1,
        start_date: input.startDate || null,
        end_date: input.endDate || null
      };
      const promo = await createPromotionService(data, context);
      return mapPromotion(promo);
    },

    updatePromotion: async (root, { id, input }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      // Look up UUID by id
      const existing = await select()
        .from('promotion')
        .where('promotion_id', '=', id)
        .load(context.pool);
      if (!existing) throw new Error('Promotion not found');

      const data = {};
      if (input.name !== undefined) data.name = input.name;
      if (input.description !== undefined) data.description = input.description;
      if (input.status !== undefined) data.status = input.status === 1 || input.status === true;
      if (input.type !== undefined) data.type = input.type;
      if (input.discountType !== undefined) data.discount_type = input.discountType;
      if (input.discountAmount !== undefined) data.discount_amount = input.discountAmount;
      if (input.minPurchaseAmount !== undefined) data.min_purchase_amount = input.minPurchaseAmount;
      if (input.targetProducts !== undefined) data.target_products = input.targetProducts;
      if (input.buyQty !== undefined) data.buy_qty = input.buyQty;
      if (input.getQty !== undefined) data.get_qty = input.getQty;
      if (input.getDiscount !== undefined) data.get_discount = input.getDiscount;
      if (input.maxDiscountAmount !== undefined) data.max_discount_amount = input.maxDiscountAmount;
      if (input.priority !== undefined) data.priority = input.priority;
      if (input.stackableWithCoupons !== undefined) data.stackable_with_coupons = input.stackableWithCoupons !== 0;
      if (input.stackableWithPromotions !== undefined) data.stackable_with_promotions = input.stackableWithPromotions === 1;
      if (input.startDate !== undefined) data.start_date = input.startDate;
      if (input.endDate !== undefined) data.end_date = input.endDate;

      const promo = await updatePromotionService(existing.uuid, data, context);
      return mapPromotion(promo);
    },

    deletePromotion: async (root, { id }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      const existing = await select()
        .from('promotion')
        .where('promotion_id', '=', id)
        .load(context.pool);
      if (!existing) throw new Error('Promotion not found');
      await deletePromotionService(existing.uuid, context);
      return true;
    }
  },

  Promotion: {
    editUrl: ({ uuid }) => buildUrl('promotionEdit', { id: uuid }),
    updateApi: ({ uuid }) => buildUrl('updatePromotion', { id: uuid }),
    deleteApi: ({ uuid }) => buildUrl('deletePromotion', { id: uuid })
  }
};
