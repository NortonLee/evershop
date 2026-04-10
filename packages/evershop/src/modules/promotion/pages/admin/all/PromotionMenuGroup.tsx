import { NavigationItemGroup } from '@components/admin/NavigationItemGroup.js';
import { TagIcon } from 'lucide-react';
import React from 'react';

interface PromotionMenuGroupProps {
  couponGrid: string;
  promotionGrid: string;
}

export default function PromotionMenuGroup({
  couponGrid,
  promotionGrid
}: PromotionMenuGroupProps) {
  return (
    <NavigationItemGroup
      id="promotionMenuGroup"
      name="Promotion"
      items={[
        {
          Icon: TagIcon,
          url: promotionGrid,
          title: 'Promotions'
        }
      ]}
    />
  );
}

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 51
};

export const query = `
  query Query {
    couponGrid: url(routeId: "couponGrid"),
    promotionGrid: url(routeId: "promotionGrid")
  }
`;
