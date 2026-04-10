import { FormButtons } from '@components/admin/FormButtons.js';
import Area from '@components/common/Area.js';
import { Form } from '@components/common/form/Form.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import React from 'react';

interface PromotionEditFormProps {
  action: string;
  gridUrl: string;
}

export default function PromotionEditForm({ action, gridUrl }: PromotionEditFormProps) {
  return (
    <Form method="PUT" action={action} submitBtn={false} id="promotionEditForm">
      <div className="grid grid-cols-1 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>
              Basic information about the promotion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Area id="promotionFormGeneral" noOuter />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Discount Configuration</CardTitle>
            <CardDescription>
              Configure the discount type and amount for this promotion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Area id="promotionFormDiscount" noOuter />
          </CardContent>
        </Card>
        <div className="grid grid-cols-3 gap-x-5 grid-flow-row">
          <div className="col-span-2 grid grid-cols-1 gap-5 auto-rows-max">
            <Card>
              <CardHeader>
                <CardTitle>Promotion Rules</CardTitle>
                <CardDescription>
                  Configure the rules specific to this promotion type.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Area id="promotionFormRules" noOuter />
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1 grid grid-cols-1 gap-5 auto-rows-max">
            <Card>
              <CardHeader>
                <CardTitle>Stacking Rules</CardTitle>
                <CardDescription>
                  Configure how this promotion interacts with coupons and other promotions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Area id="promotionFormStacking" noOuter />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Promotion Conflicts</CardTitle>
                <CardDescription>
                  Active conflicts detected with other promotions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Area id="promotionFormConflicts" noOuter />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <FormButtons cancelUrl={gridUrl} formId="promotionEditForm" />
    </Form>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

export const query = `
  query Query {
    action: url(routeId: "updatePromotion", params: [{key: "id", value: getContextValue("promotionUuid")}]),
    gridUrl: url(routeId: "promotionGrid")
  }
`;
