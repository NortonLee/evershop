import React from 'react';

interface PromotionConflict {
  type: string;
  message: string;
  promotionIds: number[];
}

interface ConflictAlertProps {
  promotionConflicts: PromotionConflict[];
}

export default function ConflictAlert({ promotionConflicts }: ConflictAlertProps) {
  if (!promotionConflicts || promotionConflicts.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 border border-green-200">
        <span className="text-green-600 text-sm font-medium">✓ No conflicts detected</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold">
          {promotionConflicts.length}
        </span>
        <span className="text-sm font-medium text-orange-700">
          {promotionConflicts.length === 1 ? '1 Conflict Detected' : `${promotionConflicts.length} Conflicts Detected`}
        </span>
      </div>
      {promotionConflicts.map((conflict, index) => (
        <div
          key={index}
          className={`p-3 rounded-md border text-sm ${
            conflict.type === 'promotion_coupon'
              ? 'bg-red-50 border-red-300 text-red-800'
              : 'bg-orange-50 border-orange-300 text-orange-800'
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="text-lg leading-none">
              {conflict.type === 'promotion_coupon' ? '🔴' : '🟠'}
            </span>
            <div>
              <span className="font-medium capitalize">
                {conflict.type === 'promotion_coupon' ? 'Coupon Conflict' : 'Promotion Conflict'}:
              </span>{' '}
              {conflict.message}
              {conflict.promotionIds && conflict.promotionIds.length > 0 && (
                <p className="text-xs mt-1 opacity-75">
                  Affected promotion IDs: {conflict.promotionIds.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const layout = {
  areaId: 'promotionFormConflicts',
  sortOrder: 10
};

export const query = `
  query Query {
    promotionConflicts {
      type
      message
      promotionIds
    }
  }
`;
