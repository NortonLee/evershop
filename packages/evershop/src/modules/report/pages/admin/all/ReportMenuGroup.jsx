import { NavigationItemGroup } from '@components/admin/NavigationItemGroup.js';
import { TrendingUp } from 'lucide-react';
import PropTypes from 'prop-types';
import React from 'react';

export default function ReportMenuGroup({ reportDashboard }) {
  return (
    <NavigationItemGroup
      id="reportMenuGroup"
      name="Reports"
      items={[
        {
          Icon: TrendingUp,
          url: reportDashboard,
          title: 'Reports'
        }
      ]}
    />
  );
}

ReportMenuGroup.propTypes = {
  reportDashboard: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 40
};

export const query = `
  query Query {
    reportDashboard: url(routeId: "reportDashboard")
  }
`;
