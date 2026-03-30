import Area from '@components/common/Area.js';
import { InputField } from '@components/common/form/InputField.js';
import { RadioGroupField } from '@components/common/form/RadioGroupField.js';
import { TextareaField } from '@components/common/form/TextareaField.js';
import React, { useState } from 'react';

interface Promotion {
  name: string;
  description?: string;
  status: number;
  type: string;
  startDate?: { text: string; value: string };
  endDate?: { text: string; value: string };
}

interface GeneralProps {
  promotion?: Promotion;
}

export default function General({ promotion }: GeneralProps) {
  const [selectedType, setSelectedType] = useState(promotion?.type || 'spend_and_save');

  return (
    <Area
      id="promotionFormGeneral"
      className="space-y-4"
      coreComponents={[
        {
          component: {
            default: (
              <InputField
                name="name"
                label="Promotion Name"
                defaultValue={promotion?.name || ''}
                placeholder="Enter promotion name"
                required
                validation={{
                  required: 'Promotion name is required'
                }}
              />
            )
          },
          sortOrder: 10
        },
        {
          component: {
            default: (
              <TextareaField
                name="description"
                label="Description"
                defaultValue={promotion?.description || ''}
                placeholder="Enter description (optional)"
              />
            )
          },
          sortOrder: 20
        },
        {
          component: {
            default: (
              <RadioGroupField
                name="status"
                label="Status"
                options={[
                  { label: 'Enabled', value: 1 },
                  { label: 'Disabled', value: 0 }
                ]}
                defaultValue={promotion?.status === 0 ? 0 : 1}
                required
                validation={{
                  required: 'Status is required',
                  valueAsNumber: true
                }}
              />
            )
          },
          sortOrder: 30
        },
        {
          component: {
            default: () => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Promotion Type</label>
                <select
                  name="type"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  required
                >
                  <option value="spend_and_save">Spend &amp; Save</option>
                  <option value="bogo">Buy X Get Y (BOGO)</option>
                  <option value="limited_time">Limited Time Offer</option>
                </select>
                <p className="text-xs text-gray-500">
                  {selectedType === 'spend_and_save' && 'Customers get a discount when their cart total reaches a minimum amount.'}
                  {selectedType === 'bogo' && 'Customers buy a set quantity and receive another quantity at a discounted price.'}
                  {selectedType === 'limited_time' && 'A discount available only within a specific date range (start and end dates required).'}
                </p>
              </div>
            )
          },
          sortOrder: 40
        },
        {
          component: {
            default: () => (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="start_date"
                  label="Start Date"
                  type="date"
                  defaultValue={promotion?.startDate?.value || ''}
                  placeholder="YYYY-MM-DD"
                />
                <InputField
                  name="end_date"
                  label="End Date"
                  type="date"
                  defaultValue={promotion?.endDate?.value || ''}
                  placeholder="YYYY-MM-DD"
                />
              </div>
            )
          },
          sortOrder: 50
        }
      ]}
    />
  );
}

export const layout = {
  areaId: 'promotionFormGeneral',
  sortOrder: 10
};

export const query = `
  query Query {
    promotion(id: getContextValue('promotionId', null)) {
      name
      description
      status
      type
      startDate {
        text
        value
      }
      endDate {
        text
        value
      }
    }
  }
`;
