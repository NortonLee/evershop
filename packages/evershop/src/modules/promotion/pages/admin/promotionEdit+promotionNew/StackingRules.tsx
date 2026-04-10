import Area from '@components/common/Area.js';
import { CheckboxField } from '@components/common/form/CheckboxField.js';
import { InputField } from '@components/common/form/InputField.js';
import React from 'react';

interface Promotion {
  stackableWithCoupons: number;
  stackableWithPromotions: number;
  priority: number;
}

interface StackingRulesProps {
  promotion?: Promotion;
}

export default function StackingRules({ promotion }: StackingRulesProps) {
  return (
    <Area
      id="promotionFormStacking"
      className="space-y-4"
      coreComponents={[
        {
          component: {
            default: (
              <CheckboxField
                name="stackable_with_coupons"
                label="Stackable with Coupons"
                defaultValue={(promotion?.stackableWithCoupons ?? 1) === 1}
                helpText="Allow this promotion to apply when a coupon is also active in the cart."
              />
            )
          },
          sortOrder: 10
        },
        {
          component: {
            default: (
              <CheckboxField
                name="stackable_with_promotions"
                label="Stackable with Other Promotions"
                defaultValue={(promotion?.stackableWithPromotions ?? 0) === 1}
                helpText="Allow this promotion to apply alongside other automatic promotions. If unchecked, only the highest-priority promotion applies."
              />
            )
          },
          sortOrder: 20
        },
        {
          component: {
            default: (
              <div className="space-y-2">
                <InputField
                  name="priority"
                  label="Priority"
                  type="number"
                  defaultValue={promotion?.priority ?? 0}
                  placeholder="0"
                  validation={{
                    min: { value: 0, message: 'Priority must be non-negative' },
                    valueAsNumber: true
                  }}
                />
                <p className="text-xs text-gray-500">
                  Higher priority promotions are applied first when conflicts occur. Range: 0 (lowest) to 100+ (highest).
                </p>
              </div>
            )
          },
          sortOrder: 30
        }
      ]}
    />
  );
}

export const layout = {
  areaId: 'promotionFormStacking',
  sortOrder: 10
};

export const query = `
  query Query {
    promotion(id: getContextValue('promotionId', null)) {
      stackableWithCoupons
      stackableWithPromotions
      priority
    }
  }
`;
