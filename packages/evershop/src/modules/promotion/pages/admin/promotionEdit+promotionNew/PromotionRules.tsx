import Area from '@components/common/Area.js';
import { InputField } from '@components/common/form/InputField.js';
import React, { useEffect, useState } from 'react';

interface Promotion {
  type: string;
  minPurchaseAmount?: number;
  buyQty?: number;
  getQty?: number;
  getDiscount?: number;
}

interface PromotionRulesProps {
  promotion?: Promotion;
}

function SpendAndSaveRules({ promotion }: { promotion?: Promotion }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Customers receive a discount when their cart total reaches the minimum purchase amount.
      </p>
      <InputField
        name="min_purchase_amount"
        label="Minimum Purchase Amount ($)"
        type="number"
        defaultValue={promotion?.minPurchaseAmount ?? ''}
        placeholder="e.g. 50.00"
        required
        validation={{
          required: 'Minimum purchase amount is required for Spend & Save promotions',
          min: { value: 0, message: 'Amount must be non-negative' },
          valueAsNumber: true
        }}
      />
    </div>
  );
}

function BOGORules({ promotion }: { promotion?: Promotion }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Customers buy a set quantity and receive another quantity at a discounted price.
      </p>
      <div className="grid grid-cols-3 gap-4">
        <InputField
          name="buy_qty"
          label="Buy Quantity"
          type="number"
          defaultValue={promotion?.buyQty ?? 1}
          placeholder="e.g. 2"
          required
          validation={{
            required: 'Buy quantity is required for BOGO promotions',
            min: { value: 1, message: 'Must buy at least 1 item' },
            valueAsNumber: true
          }}
        />
        <InputField
          name="get_qty"
          label="Get Quantity"
          type="number"
          defaultValue={promotion?.getQty ?? 1}
          placeholder="e.g. 1"
          required
          validation={{
            required: 'Get quantity is required for BOGO promotions',
            min: { value: 1, message: 'Must get at least 1 item' },
            valueAsNumber: true
          }}
        />
        <InputField
          name="get_discount"
          label="Discount on Get Items (%)"
          type="number"
          defaultValue={promotion?.getDiscount ?? 100}
          placeholder="e.g. 100 for free"
          required
          validation={{
            required: 'Discount percentage is required for BOGO promotions',
            min: { value: 0, message: 'Must be non-negative' },
            max: { value: 100, message: 'Cannot exceed 100%' },
            valueAsNumber: true
          }}
        />
      </div>
    </div>
  );
}

function LimitedTimeRules({ promotion }: { promotion?: Promotion }) {
  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
        <p className="text-sm text-yellow-800 font-medium">⚠️ Date Range Required</p>
        <p className="text-sm text-yellow-700 mt-1">
          Limited Time promotions must have both a Start Date and End Date set in the General section above.
          The promotion will be automatically invalid without both dates.
        </p>
      </div>
      <InputField
        name="min_purchase_amount"
        label="Minimum Purchase Amount ($, optional)"
        type="number"
        defaultValue={promotion?.minPurchaseAmount ?? ''}
        placeholder="Leave empty for no minimum"
        validation={{
          min: { value: 0, message: 'Amount must be non-negative' },
          valueAsNumber: true
        }}
      />
    </div>
  );
}

export default function PromotionRules({ promotion }: PromotionRulesProps) {
  const [currentType, setCurrentType] = useState(promotion?.type || 'spend_and_save');

  // Listen for type changes from the General component
  useEffect(() => {
    const typeSelect = document.querySelector('select[name="type"]') as HTMLSelectElement;
    if (!typeSelect) return;

    const handleChange = (e: Event) => {
      setCurrentType((e.target as HTMLSelectElement).value);
    };
    typeSelect.addEventListener('change', handleChange);
    return () => typeSelect.removeEventListener('change', handleChange);
  }, []);

  return (
    <Area
      id="promotionFormRules"
      className="space-y-4"
      coreComponents={[
        {
          component: {
            default: () => (
              <div>
                {currentType === 'spend_and_save' && (
                  <SpendAndSaveRules promotion={promotion} />
                )}
                {currentType === 'bogo' && (
                  <BOGORules promotion={promotion} />
                )}
                {currentType === 'limited_time' && (
                  <LimitedTimeRules promotion={promotion} />
                )}
              </div>
            )
          },
          sortOrder: 10
        }
      ]}
    />
  );
}

export const layout = {
  areaId: 'promotionFormRules',
  sortOrder: 10
};

export const query = `
  query Query {
    promotion(id: getContextValue('promotionId', null)) {
      type
      minPurchaseAmount
      buyQty
      getQty
      getDiscount
    }
  }
`;
