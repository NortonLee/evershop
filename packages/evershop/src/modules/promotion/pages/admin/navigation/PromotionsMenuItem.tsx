import { NavigationItem } from '@components/admin/NavigationItem.js';
import { Tag } from 'lucide-react';
import React from 'react';

interface PromotionsMenuItemProps {
  url: string;
}

export default function PromotionsMenuItem({ url }: PromotionsMenuItemProps) {
  return <NavigationItem Icon={Tag} title="Promotions" url={url} />;
}
