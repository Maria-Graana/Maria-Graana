/** @format */

const role = {
  Diary: {
    roles: [
      { role: 'regional_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'zonal_manager', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'branch_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'business_centre_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'call_centre_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'area_manager', access: { v: true, a: true, e: true, d: true } },
      { role: 'sales_agent', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'business_centre_agent',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'call_centre_warrior',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'call_centre_agent',
        access: { v: true, a: true, e: true, d: true },
      },
    ],
  },
  Inventory: {
    roles: [
      {
        role: 'group_management',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'group_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'country_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'regional_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'zonal_manager', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'branch_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'area_manager', access: { v: true, a: true, e: true, d: true } },
      { role: 'sales_agent', access: { v: true, a: true, e: true, d: true } },
    ],
  },
  InventoryTabs: {
    roles: [
      {
        role: 'group_management',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'group_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'country_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'regional_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'zonal_manager', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'branch_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'area_manager', access: { v: true, a: true, e: true, d: true } },
      { role: 'sales_agent', access: { v: true, a: true, e: true, d: true } },
    ],
  },
  TeamDiary: {
    roles: [
      {
        role: 'group_management',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'group_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'country_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'regional_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'zonal_manager', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'branch_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'business_centre_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'call_centre_manager',
        access: { v: true, a: true, e: true, d: true },
      },
    ],
  },
  Client: {
    roles: [
      {
        role: 'group_management',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'group_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'country_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'regional_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'zonal_manager', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'branch_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'business_centre_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'call_centre_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'area_manager', access: { v: true, a: true, e: true, d: true } },
      { role: 'sales_agent', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'business_centre_agent',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'call_centre_warrior',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'call_centre_agent',
        access: { v: true, a: true, e: true, d: true },
      },
    ],
  },
  Targets: {
    roles: [
      { role: 'regional_head', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'zonal_manager',
        access: { v: true, a: true, e: false, d: false },
      },
      {
        role: 'branch_manager',
        access: { v: true, a: true, e: false, d: false },
      },
      {
        role: 'business_centre_manager',
        access: { v: true, a: true, e: false, d: false },
      },
      {
        role: 'call_centre_manager',
        access: { v: true, a: true, e: false, d: false },
      },
      {
        role: 'area_manager',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'sales_agent',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'business_centre_agent',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'call_centre_warrior',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'call_centre_agent',
        access: { v: true, a: false, e: false, d: false },
      },
    ],
  },
  Leads: {
    roles: [
      {
        role: 'group_management',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'group_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'country_head', access: { v: true, a: false, e: false, d: false } },
      { role: 'regional_head', access: { v: true, a: true, e: true, d: true } },
      { role: 'zonal_manager', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'branch_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'business_centre_manager',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'call_centre_manager',
        access: { v: true, a: false, e: false, d: false },
      },
      { role: 'area_manager', access: { v: true, a: true, e: true, d: true } },
      { role: 'sales_agent', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'business_centre_agent',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'call_centre_warrior',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'call_centre_agent',
        access: { v: true, a: true, e: true, d: true },
      },
    ],
  },
  CreateUser: {
    roles: [],
  },
  Dashboard: {
    roles: [
      {
        role: 'group_management',
        access: { v: true, a: false, e: false, d: false },
      },
      { role: 'group_head', access: { v: true, a: false, e: false, d: false } },
      {
        role: 'country_head',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'regional_head',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'zonal_manager',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'branch_manager',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'business_centre_manager',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'call_centre_manager',
        access: { v: true, a: false, e: false, d: false },
      },
      { role: 'area_manager', access: { v: true, a: true, e: true, d: true } },
      { role: 'sales_agent', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'business_centre_agent',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'call_centre_warrior',
        access: { v: true, a: true, e: true, d: true },
      },
      {
        role: 'call_centre_agent',
        access: { v: true, a: true, e: true, d: true },
      },
    ],
  },
  AssignLead: {
    roles: [
      {
        role: 'group_management',
        access: { v: true, a: false, e: false, d: false },
      },
      { role: 'group_head', access: { v: true, a: false, e: false, d: false } },
      {
        role: 'country_head',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'regional_head',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'zonal_manager',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'branch_manager',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'business_centre_manager',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'call_centre_manager',
        access: { v: true, a: false, e: false, d: false },
      },
    ],
  },
  AssignedAreas: {
    roles: [
      {
        role: 'regional_head',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'zonal_manager',
        access: { v: true, a: false, e: false, d: false },
      },
      {
        role: 'branch_manager',
        access: { v: true, a: false, e: false, d: false },
      },
      { role: 'area_manager', access: { v: true, a: true, e: true, d: true } },
      { role: 'sales_agent', access: { v: true, a: true, e: true, d: true } },
    ],
  },
}

module.exports = role
