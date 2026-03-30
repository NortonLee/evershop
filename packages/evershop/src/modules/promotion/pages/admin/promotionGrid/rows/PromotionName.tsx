import { TableCell } from '@components/common/ui/Table.js';
import React from 'react';

interface PromotionNameProps {
  url: string;
  name: string;
}

export function PromotionName({ url, name }: PromotionNameProps) {
  return (
    <TableCell>
      <a href={url} className="font-medium text-blue-600 hover:underline">
        {name}
      </a>
    </TableCell>
  );
}
