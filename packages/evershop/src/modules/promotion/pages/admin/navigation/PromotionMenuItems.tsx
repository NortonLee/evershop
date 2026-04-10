import { NavigationItem } from '@components/admin/NavigationItem.js';
import { PlusCircle } from 'lucide-react';
import React from 'react';

interface PromotionNewMenuItemProps {
  url: string;
}

export default function PromotionNewMenuItem({ url }: PromotionNewMenuItemProps) {
  return <NavigationItem Icon={PlusCircle} title="New Promotion" url={url} />;
}
