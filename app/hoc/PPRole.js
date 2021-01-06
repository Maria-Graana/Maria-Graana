/** @format */

const PPRole = {
  Diary: {
    roles: [
      { role: 'zonal_manager', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'branch_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'area_manager', access: { v: true, a: true, e: true, d: true } },
      { role: 'sales_agent', access: { v: true, a: true, e: true, d: true } },
    ],
  },
  Inventory: {
    roles: [
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
      { role: 'zonal_manager', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'branch_manager',
        access: { v: true, a: true, e: true, d: true },
      },
    ],
  },
  Client: {
    roles: [
      { role: 'zonal_manager', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'branch_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'area_manager', access: { v: true, a: true, e: true, d: true } },
      { role: 'sales_agent', access: { v: true, a: true, e: true, d: true } },
    ],
  },
  Targets: {
    roles: [],
  },
  Leads: {
    roles: [
      { role: 'zonal_manager', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'branch_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'area_manager', access: { v: true, a: true, e: true, d: true } },
      { role: 'sales_agent', access: { v: true, a: true, e: true, d: true } },
    ],
  },
  CreateUser: {
    roles: [],
  },
  Dashboard: {
    roles: [
      { role: 'zonal_manager', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'branch_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'area_manager', access: { v: true, a: true, e: true, d: true } },
      { role: 'sales_agent', access: { v: true, a: true, e: true, d: true } },
    ],
  },
  AssignLead: {
    roles: [
      { role: 'zonal_manager', access: { v: true, a: true, e: true, d: true } },
      {
        role: 'branch_manager',
        access: { v: true, a: true, e: true, d: true },
      },
      { role: 'area_manager', access: { v: true, a: true, e: true, d: true } },
      { role: 'sales_agent', access: { v: true, a: true, e: true, d: true } },
    ],
  },
  AssignedAreas: {
    roles: [],
  },
}

module.exports = PPRole
