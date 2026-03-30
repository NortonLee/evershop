import { Button } from '@components/common/ui/Button.js';
import React from 'react';

interface NewPromotionButtonProps {
  promotionNew: string;
}

export default function NewPromotionButton({ promotionNew }: NewPromotionButtonProps) {
  return (
    <div className="flex justify-end mb-4">
      <a href={promotionNew}>
        <Button>Add Promotion</Button>
      </a>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 5
};

export const query = `
  query Query {
    promotionNew: url(routeId: "promotionNew")
  }
`;
