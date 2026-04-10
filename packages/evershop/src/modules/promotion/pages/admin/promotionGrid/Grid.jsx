import { GridPagination } from '@components/admin/grid/GridPagination';
import { DummyColumnHeader } from '@components/admin/grid/header/Dummy';
import { SortableHeader } from '@components/admin/grid/header/Sortable';
import { Status } from '@components/admin/Status.js';
import Area from '@components/common/Area.js';
import { Form } from '@components/common/form/Form.js';
import { InputField } from '@components/common/form/InputField.js';
import { useAlertContext } from '@components/common/modal/Alert';
import { Button } from '@components/common/ui/Button.js';
import { ButtonGroup } from '@components/common/ui/ButtonGroup.js';
import { Card } from '@components/common/ui/Card';
import {
  CardAction,
  CardContent,
  CardHeader
} from '@components/common/ui/Card.js';
import { Checkbox } from '@components/common/ui/Checkbox.js';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@components/common/ui/Select.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/common/ui/Table.js';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { PromotionName } from './rows/PromotionName.js';

function Actions({ promotions = [], selectedIds = [] }) {
  const { openAlert, closeAlert } = useAlertContext();
  const [isLoading, setIsLoading] = useState(false);

  const updatePromotions = async (status) => {
    setIsLoading(true);
    const promises = promotions
      .filter((p) => selectedIds.includes(p.uuid))
      .map((p) =>
        axios.put(p.updateApi, { status })
      );
    await Promise.all(promises);
    setIsLoading(false);
    window.location.reload();
  };

  const deletePromotions = async () => {
    setIsLoading(true);
    const promises = promotions
      .filter((p) => selectedIds.includes(p.uuid))
      .map((p) => axios.delete(p.deleteApi));
    await Promise.all(promises);
    setIsLoading(false);
    window.location.reload();
  };

  const actions = [
    {
      name: 'Disable',
      onAction: () => {
        openAlert({
          heading: `Disable ${selectedIds.length} promotions`,
          content: 'Are you sure?',
          primaryAction: {
            title: 'Cancel',
            onAction: closeAlert,
            variant: 'secondary'
          },
          secondaryAction: {
            title: 'Disable',
            onAction: async () => { await updatePromotions(0); },
            variant: 'destructive'
          }
        });
      }
    },
    {
      name: 'Enable',
      onAction: () => {
        openAlert({
          heading: `Enable ${selectedIds.length} promotions`,
          content: 'Are you sure?',
          primaryAction: {
            title: 'Cancel',
            onAction: closeAlert,
            variant: 'secondary'
          },
          secondaryAction: {
            title: 'Enable',
            onAction: async () => { await updatePromotions(1); },
            variant: 'destructive'
          }
        });
      }
    },
    {
      name: 'Delete',
      onAction: () => {
        openAlert({
          heading: `Delete ${selectedIds.length} promotions`,
          content: <div>Can&apos;t be undone</div>,
          primaryAction: {
            title: 'Cancel',
            onAction: closeAlert,
            variant: 'secondary'
          },
          secondaryAction: {
            title: 'Delete',
            onAction: async () => { await deletePromotions(); },
            variant: 'destructive'
          }
        });
      }
    }
  ];

  return (
    <TableRow>
      {selectedIds.length === 0 && null}
      {selectedIds.length > 0 && (
        <TableCell colSpan="100">
          <ButtonGroup>
            {actions.map((action, i) => (
              <Button
                key={i}
                variant={'outline'}
                onClick={(e) => {
                  e.preventDefault();
                  action.onAction();
                }}
              >
                {action.name}
              </Button>
            ))}
          </ButtonGroup>
        </TableCell>
      )}
    </TableRow>
  );
}

Actions.propTypes = {
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  promotions: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      updateApi: PropTypes.string.isRequired,
      deleteApi: PropTypes.string.isRequired
    })
  ).isRequired
};

const TYPE_LABELS = {
  bogo: 'BOGO',
  limited_time: 'Limited Time'
};

export default function PromotionGrid({
  promotions: { items: promotions, total, currentFilters = [] }
}) {
  const page = currentFilters.find((f) => f.key === 'page')
    ? parseInt(currentFilters.find((f) => f.key === 'page').value, 10)
    : 1;
  const limit = currentFilters.find((f) => f.key === 'limit')
    ? parseInt(currentFilters.find((f) => f.key === 'limit').value, 10)
    : 20;
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <Form submitBtn={false} id="promotionGridFilter">
          <div className="flex gap-5 justify-center items-center">
            <Area
              id="promotionGridFilter"
              noOuter
              coreComponents={[
                {
                  component: {
                    default: () => (
                      <InputField
                        name="name"
                        placeholder="Search by name"
                        defaultValue={
                          currentFilters.find((f) => f.key === 'name')?.value
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const url = new URL(document.location);
                            const name = e.target?.value;
                            if (name) {
                              url.searchParams.set('name[operation]', 'like');
                              url.searchParams.set('name[value]', name);
                            } else {
                              url.searchParams.delete('name[operation]');
                              url.searchParams.delete('name[value]');
                            }
                            window.location.href = url;
                          }
                        }}
                      />
                    )
                  },
                  sortOrder: 5
                },
                {
                  component: {
                    default: () => (
                      <Select
                        value={currentFilters.find((f) => f.key === 'status')?.value}
                        onValueChange={(value) => {
                          const url = new URL(document.location);
                          url.searchParams.set('status', value);
                          window.location.href = url.href;
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue>Status</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="1">Enabled</SelectItem>
                            <SelectItem value="0">Disabled</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )
                  },
                  sortOrder: 10
                },
                {
                  component: {
                    default: () => (
                      <Select
                        value={currentFilters.find((f) => f.key === 'type')?.value}
                        onValueChange={(value) => {
                          const url = new URL(document.location);
                          url.searchParams.set('type', value);
                          window.location.href = url.href;
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue>Type</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Type</SelectLabel>
                            <SelectItem value="spend_and_save">Spend &amp; Save</SelectItem>
                            <SelectItem value="bogo">BOGO</SelectItem>
                            <SelectItem value="limited_time">Limited Time</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )
                  },
                  sortOrder: 15
                }
              ]}
              currentFilters={currentFilters}
            />
          </div>
        </Form>
        <CardAction>
          <Button
            variant="link"
            onClick={() => {
              const url = new URL(document.location);
              url.search = '';
              window.location.href = url.href;
            }}
          >
            Clear filter
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="form-field mb-0">
                  <Checkbox
                    onCheckedChange={(checked) => {
                      if (checked) setSelectedRows(promotions.map((p) => p.uuid));
                      else setSelectedRows([]);
                    }}
                  />
                </div>
              </TableHead>
              <Area
                id="promotionGridHeader"
                noOuter
                coreComponents={[
                  {
                    component: {
                      default: () => (
                        <SortableHeader
                          title="Name"
                          name="name"
                          currentFilters={currentFilters}
                        />
                      )
                    },
                    sortOrder: 10
                  },
                  {
                    component: {
                      default: () => <DummyColumnHeader title="Type" />
                    },
                    sortOrder: 20
                  },
                  {
                    component: {
                      default: () => (
                        <SortableHeader
                          title="Status"
                          name="status"
                          currentFilters={currentFilters}
                        />
                      )
                    },
                    sortOrder: 30
                  },
                  {
                    component: {
                      default: () => <DummyColumnHeader title="Discount" />
                    },
                    sortOrder: 40
                  },
                  {
                    component: {
                      default: () => <DummyColumnHeader title="Date Range" />
                    },
                    sortOrder: 50
                  },
                  {
                    component: {
                      default: () => (
                        <SortableHeader
                          title="Priority"
                          name="priority"
                          currentFilters={currentFilters}
                        />
                      )
                    },
                    sortOrder: 60
                  }
                ]}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            <Actions
              promotions={promotions}
              selectedIds={selectedRows}
            />
            {promotions.map((p) => (
              <TableRow key={p.promotionId}>
                <TableHead>
                  <div className="form-field mb-0">
                    <Checkbox
                      checked={selectedRows.includes(p.uuid)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRows(selectedRows.concat([p.uuid]));
                        } else {
                          setSelectedRows(
                            selectedRows.filter((row) => row !== p.uuid)
                          );
                        }
                      }}
                    />
                  </div>
                </TableHead>
                <Area
                  id="promotionGridRow"
                  row={p}
                  noOuter
                  coreComponents={[
                    {
                      component: {
                        default: () => (
                          <PromotionName url={p.editUrl} name={p.name} />
                        )
                      },
                      sortOrder: 10
                    },
                    {
                      component: {
                        default: () => (
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {TYPE_LABELS[p.type] || p.type}
                            </span>
                          </TableCell>
                        )
                      },
                      sortOrder: 20
                    },
                    {
                      component: {
                        default: () => <Status status={parseInt(p.status, 10)} />
                      },
                      sortOrder: 30
                    },
                    {
                      component: {
                        default: () => (
                          <TableCell>
                            {p.discountType === 'percentage'
                              ? `${p.discountAmount}%`
                              : `$${p.discountAmount}`}
                          </TableCell>
                        )
                      },
                      sortOrder: 40
                    },
                    {
                      component: {
                        default: () => (
                          <TableCell>
                            {p.startDate?.text || '--'} → {p.endDate?.text || '--'}
                          </TableCell>
                        )
                      },
                      sortOrder: 50
                    },
                    {
                      component: {
                        default: () => (
                          <TableCell>{p.priority}</TableCell>
                        )
                      },
                      sortOrder: 60
                    }
                  ]}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {promotions.length === 0 && (
          <div className="flex w-full justify-center mt-2">
            There are no promotions to display
          </div>
        )}
        <GridPagination total={total} limit={limit} page={page} />
      </CardContent>
    </Card>
  );
}

PromotionGrid.propTypes = {
  promotions: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        promotionId: PropTypes.number.isRequired,
        uuid: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        discountType: PropTypes.string.isRequired,
        discountAmount: PropTypes.number.isRequired,
        priority: PropTypes.number.isRequired,
        editUrl: PropTypes.string.isRequired,
        updateApi: PropTypes.string.isRequired,
        deleteApi: PropTypes.string.isRequired
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
    currentFilters: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        operation: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

export const layout = {
  areaId: 'content',
  sortOrder: 20
};

export const query = `
  query Query($filters: [FilterInput]) {
    promotions(filters: $filters) {
      items {
        promotionId
        uuid
        name
        status
        type
        discountType
        discountAmount
        priority
        startDate {
          text
        }
        endDate {
          text
        }
        editUrl
        updateApi
        deleteApi
      }
      total
      currentFilters {
        key
        operation
        value
      }
    }
  }
`;

export const variables = `
{
  filters: getContextValue('filtersFromUrl')
}`;
