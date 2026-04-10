import Area from '@components/common/Area.js';
import { InputField } from '@components/common/form/InputField.js';
import { RadioGroupField } from '@components/common/form/RadioGroupField.js';
import React from 'react';

interface Promotion {
  discountType: string;
  discountAmount: number;
  maxDiscountAmount?: number;
}

interface DiscountConfigProps {
  promotion?: Promotion;
}

export default function DiscountConfig({ promotion }: DiscountConfigProps) {
  return (
    <Area
      id="promotionFormDiscount"
      className="space-y-4"
      coreComponents={[
        {
          component: {
            default: (
              <RadioGroupField
                name="discount_type"
                label="Discount Type"
                options={[
                  { label: 'Percentage (%)', value: 'percentage' },
                  { label: 'Fixed Amount ($)', value: 'fixed' }
                ]}
                defaultValue={promotion?.discountType || 'percentage'}
                required
                validation={{
                  required: 'Discount type is required'
                }}
              />
            )
          },
          sortOrder: 10
        },
        {
          component: {
            default: (
              <InputField
                name="discount_amount"
                label="Discount Amount"
                type="number"
                defaultValue={promotion?.discountAmount ?? ''}
                placeholder="e.g. 10 for 10% or $10"
                required
                validation={{
                  required: 'Discount amount is required',
                  min: { value: 0, message: 'Discount must be non-negative' },
                  valueAsNumber: true
                }}
              />
            )
          },
          sortOrder: 20
        },
        {
          component: {
            default: (
              <InputField
                name="max_discount_amount"
                label="Maximum Discount Cap (optional)"
                type="number"
                defaultValue={promotion?.maxDiscountAmount ?? ''}
                placeholder="Leave empty for no cap"
                validation={{
                  min: { value: 0, message: 'Cap must be non-negative' },
                  valueAsNumber: true
                }}
              />
            )
          },
          sortOrder: 30
        }
      ]}
    />
  );
}

export const layout = {
  areaId: 'promotionFormDiscount',
  sortOrder: 10
};

export const query = `
  query Query {
    promotion(id: getContextValue('promotionId', null)) {
      discountType
      discountAmount
      maxDiscountAmount
    }
  }
`;
