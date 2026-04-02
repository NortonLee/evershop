import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '@components/common/ui/Item.js';
import { Label } from '@components/common/ui/Label.js';
import {
  RadioGroup,
  RadioGroupItem
} from '@components/common/ui/RadioGroup.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import { ExtendedCustomerAddress } from '@components/frontStore/customer/CustomerContext.js';
import React from 'react';

interface SavedAddressSelectorProps {
  addresses: ExtendedCustomerAddress[];
  onSelect: (address: ExtendedCustomerAddress | null) => void;
  selectedAddressUuid?: string;
}

export function SavedAddressSelector({
  addresses,
  onSelect,
  selectedAddressUuid
}: SavedAddressSelectorProps) {
  if (!addresses || addresses.length === 0) {
    return null;
  }

  const handleValueChange = (value: string) => {
    if (value === 'new') {
      onSelect(null);
    } else {
      const selected = addresses.find((addr) => addr.uuid === value);
      if (selected) {
        onSelect(selected);
      }
    }
  };

  const currentValue = selectedAddressUuid ?? 'new';

  return (
    <div className="saved-address-selector mb-6">
      <p className="text-sm font-medium mb-3">{_('Use a saved address')}</p>
      <RadioGroup value={currentValue} onValueChange={handleValueChange}>
        {addresses.map((addr) => (
          <Item key={addr.uuid ?? addr.addressId} variant="outline">
            <ItemContent>
              <ItemTitle>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    id={`saved-addr-${addr.uuid ?? addr.addressId}`}
                    value={addr.uuid ?? String(addr.addressId)}
                  />
                  <Label htmlFor={`saved-addr-${addr.uuid ?? addr.addressId}`}>
                    {addr.fullName}
                  </Label>
                </div>
              </ItemTitle>
              <ItemDescription className="text-inherit mt-1 line-clamp-none">
                <div className="pl-7 text-sm text-muted-foreground space-y-0.5">
                  {addr.address1 && <div>{addr.address1}</div>}
                  {addr.address2 && <div>{addr.address2}</div>}
                  <div>
                    {[addr.city, addr.province?.name, addr.postcode]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                  {addr.country && <div>{addr.country.name}</div>}
                  {addr.telephone && <div>{addr.telephone}</div>}
                </div>
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}

        <Item variant="outline">
          <ItemContent>
            <ItemTitle>
              <div className="flex items-center space-x-3">
                <RadioGroupItem id="saved-addr-new" value="new" />
                <Label htmlFor="saved-addr-new">
                  {_('Or enter a new address')}
                </Label>
              </div>
            </ItemTitle>
          </ItemContent>
        </Item>
      </RadioGroup>
    </div>
  );
}
