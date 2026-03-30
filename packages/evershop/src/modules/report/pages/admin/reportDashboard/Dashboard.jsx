import { Button } from '@components/common/ui/Button.js';
import { ButtonGroup } from '@components/common/ui/ButtonGroup.js';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const PERIODS = [
  { id: 'today', label: 'Today' },
  { id: 'last7days', label: 'Last 7 Days' },
  { id: 'last30days', label: 'Last 30 Days' }
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function StatCard({ title, value, description }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string
};

function SkeletonCard() {
  return (
    <Card>
      <CardContent>
        <div className="h-16 w-full animate-pulse rounded bg-gray-200" />
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-72 w-full animate-pulse rounded bg-gray-200" />
  );
}

function revenueTooltipFormatter(value, name) {
  if (name === 'Revenue') {
    return [formatCurrency(value), name];
  }
  return [value, name];
}

export default function ReportDashboard({
  orderReportApi,
  customerReportApi,
  summaryApi
}) {
  const [period, setPeriod] = useState('last7days');
  const [orderData, setOrderData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Fetch today's summary stats once on mount
  useEffect(() => {
    fetch(summaryApi, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((json) => {
        setSummary(json);
        setLoadingSummary(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setLoadingSummary(false);
      });
  }, [summaryApi]);

  // Fetch chart data whenever period changes
  useEffect(() => {
    setLoadingOrders(true);
    setLoadingCustomers(true);

    fetch(`${orderReportApi}?period=${period}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((json) => {
        setOrderData(Array.isArray(json) ? json : []);
        setLoadingOrders(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setLoadingOrders(false);
      });

    fetch(`${customerReportApi}?period=${period}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((json) => {
        setCustomerData(Array.isArray(json) ? json : []);
        setLoadingCustomers(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setLoadingCustomers(false);
      });
  }, [period, orderReportApi, customerReportApi]);

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loadingSummary ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              title="Orders Today"
              value={summary?.totalOrders ?? 0}
              description="Total orders placed today"
            />
            <StatCard
              title="Revenue Today"
              value={formatCurrency(summary?.totalRevenue ?? 0)}
              description="Total revenue from today's orders"
            />
            <StatCard
              title="New Customers Today"
              value={summary?.newCustomers ?? 0}
              description="New registrations today"
            />
          </>
        )}
      </div>

      {/* Period Selector */}
      <div className="flex justify-end">
        <ButtonGroup>
          {PERIODS.map(({ id, label }) => (
            <Button
              key={id}
              onClick={() => setPeriod(id)}
              variant="outline"
            >
              {period === id ? (
                <span className="text-primary">{label}</span>
              ) : (
                label
              )}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Orders Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            Number of orders and total revenue over the selected period
          </CardDescription>
          <CardAction>
            <span className="text-xs text-gray-500">
              Bars: Orders (left axis) &amp; Revenue (right axis)
            </span>
          </CardAction>
        </CardHeader>
        <CardContent>
          {loadingOrders ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={orderData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(v) => `$${v}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={revenueTooltipFormatter} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="count"
                  name="Orders"
                  fill="#8884d8"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  name="Revenue"
                  fill="#82ca9d"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Customers Chart */}
      <Card>
        <CardHeader>
          <CardTitle>New Customers</CardTitle>
          <CardDescription>
            New customer registrations over the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingCustomers ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={customerData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="New Customers"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

ReportDashboard.propTypes = {
  orderReportApi: PropTypes.string.isRequired,
  customerReportApi: PropTypes.string.isRequired,
  summaryApi: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'content',
  sortOrder: 20
};

export const query = `
  query Query {
    orderReportApi: url(routeId: "orderreport")
    customerReportApi: url(routeId: "customerreport")
    summaryApi: url(routeId: "summarystats")
  }
`;
