import { CheckboxField } from '@components/common/form/CheckboxField.js';
import { InputField } from '@components/common/form/InputField.js';
import React from 'react';

interface StackingSettingsProps {
  stackable?: number;
  maxUsesPerOrder?: number;
  minOrderAmount?: number;
}

/**
 * Coupon stacking settings component.
 * Renders fields for stackable, max_uses_per_order, and min_order_amount.
 */
export default function StackingSettings({
  stackable,
  maxUsesPerOrder,
  minOrderAmount
}: StackingSettingsProps) {
  return (
    <div className="space-y-4">
      <CheckboxField
        name="stackable"
        label="Stackable with other coupons"
        defaultValue={stackable === 1}
        helpText="Allow this coupon to be used together with other stackable coupons in the same cart."
      />
      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="max_uses_per_order"
          label="Max Uses Per Order (optional)"
          type="number"
          defaultValue={maxUsesPerOrder ?? ''}
          placeholder="Leave empty for unlimited"
          validation={{
            min: { value: 1, message: 'Must be at least 1' },
            valueAsNumber: true
          }}
        />
        <InputField
          name="min_order_amount"
          label="Minimum Order Amount ($, optional)"
          type="number"
          defaultValue={minOrderAmount ?? ''}
          placeholder="Leave empty for no minimum"
          validation={{
            min: { value: 0, message: 'Must be non-negative' },
            valueAsNumber: true
          }}
        />
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'couponEditGeneral',
  sortOrder: 60
};

export const query = `
  query Query {
    coupon(id: getContextValue('couponId', null)) {
      stackable
      maxUsesPerOrder
      minOrderAmount
    }
  }
`;
