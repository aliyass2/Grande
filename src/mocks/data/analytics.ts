import { subMonths, format } from 'date-fns'
import { randomInt, randomFloat } from '../helpers/faker'
import { daysAgo } from '../helpers/dates'
import type {
  KpiMetric,
  TimeSeriesPoint,
  RegionDataPoint,
  DepartmentDataPoint,
  ReportDefinition,
  AnalyticsDashboardData,
  RevenueVsTargetPoint,
  InventoryHealthPoint,
  PipelineStagePoint,
  TopProduct,
} from '@/features/analytics/types'

// Generate 12 months of revenue data
function generateRevenueTrend(): TimeSeriesPoint[] {
  let base = 380000
  return Array.from({ length: 12 }, (_, i) => {
    const monthsBack = 11 - i
    const growth = 1 + (Math.random() * 0.08 - 0.02)
    base = base * growth
    return {
      date: format(subMonths(new Date(), monthsBack), 'MMM yyyy'),
      value: Math.round(base),
      label: format(subMonths(new Date(), monthsBack), 'MMM'),
    }
  })
}

export const REVENUE_TREND = generateRevenueTrend()

function generateOrdersTrend(): TimeSeriesPoint[] {
  let base = 2200
  return Array.from({ length: 12 }, (_, i) => {
    const monthsBack = 11 - i
    const growth = 1 + (Math.random() * 0.1 - 0.03)
    base = Math.round(base * growth)
    return {
      date: format(subMonths(new Date(), monthsBack), 'MMM yyyy'),
      value: base,
      label: format(subMonths(new Date(), monthsBack), 'MMM'),
    }
  })
}

export const ORDERS_TREND = generateOrdersTrend()

export const REVENUE_VS_TARGET: RevenueVsTargetPoint[] = [
  { label: 'Q1 2025', actual: 1_140_000, target: 1_200_000 },
  { label: 'Q2 2025', actual: 1_380_000, target: 1_300_000 },
  { label: 'Q3 2025', actual: 1_520_000, target: 1_450_000 },
  { label: 'Q4 2025', actual: 1_690_000, target: 1_600_000 },
]

export const INVENTORY_HEALTH: InventoryHealthPoint[] = [
  { status: 'In Stock', count: 312 },
  { status: 'Low Stock', count: 58 },
  { status: 'Out of Stock', count: 24 },
  { status: 'On Order', count: 41 },
]

export const PIPELINE_BY_STAGE: PipelineStagePoint[] = [
  { stage: 'Prospect', value: 2_840_000, deals: 94 },
  { stage: 'Qualified', value: 1_920_000, deals: 61 },
  { stage: 'Proposal', value: 1_150_000, deals: 38 },
  { stage: 'Negotiation', value: 680_000, deals: 19 },
  { stage: 'Closed Won', value: 420_000, deals: 12 },
]

export const TOP_PRODUCTS: TopProduct[] = [
  { name: 'Industrial Servo Motor X4', sku: 'SKU-0041', revenue: 348_200, units: 214, growth: 12.4 },
  { name: 'Precision Bearing Kit Pro', sku: 'SKU-0089', revenue: 291_500, units: 892, growth: 8.1 },
  { name: 'Hydraulic Control Valve HV7', sku: 'SKU-0112', revenue: 264_800, units: 178, growth: -2.3 },
  { name: 'Smart Sensor Array S3', sku: 'SKU-0057', revenue: 198_400, units: 341, growth: 22.7 },
  { name: 'Pneumatic Actuator PA9', sku: 'SKU-0203', revenue: 173_100, units: 127, growth: 5.9 },
]

export const KPI_METRICS: KpiMetric[] = [
  {
    id: 'kpi_revenue',
    label: 'Monthly Revenue',
    value: REVENUE_TREND[11].value,
    previousValue: REVENUE_TREND[10].value,
    unit: 'currency',
    trend: REVENUE_TREND[11].value > REVENUE_TREND[10].value ? 'up' : 'down',
    changePercent: ((REVENUE_TREND[11].value - REVENUE_TREND[10].value) / REVENUE_TREND[10].value) * 100,
    description: 'vs. last month',
  },
  {
    id: 'kpi_orders',
    label: 'Total Orders',
    value: 2847,
    previousValue: 2612,
    unit: 'number',
    trend: 'up',
    changePercent: 9.0,
    description: 'vs. last month',
  },
  {
    id: 'kpi_customers',
    label: 'Active Customers',
    value: 1284,
    previousValue: 1196,
    unit: 'number',
    trend: 'up',
    changePercent: 7.4,
    description: 'vs. last month',
  },
  {
    id: 'kpi_conversion',
    label: 'Conversion Rate',
    value: 3.8,
    previousValue: 3.5,
    unit: 'percent',
    trend: 'up',
    changePercent: 8.6,
    description: 'vs. last month',
  },
  {
    id: 'kpi_avg_order',
    label: 'Avg Order Value',
    value: 1847,
    previousValue: 1923,
    unit: 'currency',
    trend: 'down',
    changePercent: -3.9,
    description: 'vs. last month',
  },
  {
    id: 'kpi_inventory',
    label: 'Inventory Value',
    value: 4820000,
    previousValue: 4650000,
    unit: 'currency',
    trend: 'up',
    changePercent: 3.7,
    description: 'vs. last month',
  },
  {
    id: 'kpi_margin',
    label: 'Gross Margin',
    value: 42.6,
    previousValue: 41.1,
    unit: 'percent',
    trend: 'up',
    changePercent: 1.5,
    description: 'vs. last month',
  },
  {
    id: 'kpi_churn',
    label: 'Churn Rate',
    value: 1.8,
    previousValue: 2.1,
    unit: 'percent',
    trend: 'up',
    changePercent: -14.3,
    description: 'vs. last month',
  },
]

export const SALES_BY_REGION: RegionDataPoint[] = [
  { region: 'North America', revenue: 1840000, orders: 1240 },
  { region: 'Europe', revenue: 1120000, orders: 820 },
  { region: 'Asia Pacific', revenue: 680000, orders: 530 },
  { region: 'Latin America', revenue: 280000, orders: 190 },
  { region: 'Middle East', revenue: 160000, orders: 67 },
]

export const DEPARTMENT_BREAKDOWN: DepartmentDataPoint[] = [
  { department: 'Engineering', headcount: 45, budget: 3200000 },
  { department: 'Sales', headcount: 32, budget: 1800000 },
  { department: 'Marketing', headcount: 18, budget: 950000 },
  { department: 'Finance', headcount: 12, budget: 620000 },
  { department: 'Operations', headcount: 28, budget: 1100000 },
  { department: 'HR', headcount: 8, budget: 380000 },
]

export const DASHBOARD_DATA: AnalyticsDashboardData = {
  kpis: KPI_METRICS,
  revenueTrend: REVENUE_TREND,
  ordersTrend: ORDERS_TREND,
  salesByRegion: SALES_BY_REGION,
  departmentBreakdown: DEPARTMENT_BREAKDOWN,
  revenueVsTarget: REVENUE_VS_TARGET,
  inventoryHealth: INVENTORY_HEALTH,
  pipelineByStage: PIPELINE_BY_STAGE,
  topProducts: TOP_PRODUCTS,
}

export const MOCK_REPORTS: ReportDefinition[] = [
  {
    id: 'rpt_001',
    name: 'Monthly Revenue Summary',
    category: 'finance',
    description: 'Revenue breakdown by product category and region for the current month.',
    columns: [
      { key: 'date', label: 'Period', type: 'date' },
      { key: 'category', label: 'Category', type: 'string' },
      { key: 'region', label: 'Region', type: 'string' },
      { key: 'revenue', label: 'Revenue', type: 'currency' },
      { key: 'orders', label: 'Orders', type: 'number' },
    ],
    rowCount: 120,
    lastRunAt: daysAgo(0),
    createdAt: daysAgo(180),
  },
  {
    id: 'rpt_002',
    name: 'Sales Pipeline Analysis',
    category: 'sales',
    description: 'Opportunity pipeline value and conversion rates by sales rep.',
    columns: [
      { key: 'rep', label: 'Sales Rep', type: 'string' },
      { key: 'stage', label: 'Stage', type: 'status' },
      { key: 'deals', label: 'Deals', type: 'number' },
      { key: 'value', label: 'Pipeline Value', type: 'currency' },
      { key: 'conversionRate', label: 'Conv. Rate', type: 'number' },
    ],
    rowCount: 45,
    lastRunAt: daysAgo(1),
    createdAt: daysAgo(120),
  },
  {
    id: 'rpt_003',
    name: 'Inventory Stock Levels',
    category: 'inventory',
    description: 'Current stock levels, reorder alerts, and warehouse utilization.',
    columns: [
      { key: 'sku', label: 'SKU', type: 'string' },
      { key: 'name', label: 'Item Name', type: 'string' },
      { key: 'warehouse', label: 'Warehouse', type: 'string' },
      { key: 'stock', label: 'Current Stock', type: 'number' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    rowCount: 200,
    lastRunAt: daysAgo(0),
    createdAt: daysAgo(90),
  },
  {
    id: 'rpt_004',
    name: 'Employee Headcount Report',
    category: 'hr',
    description: 'Headcount by department, role, and employment status.',
    columns: [
      { key: 'department', label: 'Department', type: 'string' },
      { key: 'role', label: 'Role', type: 'string' },
      { key: 'headcount', label: 'Headcount', type: 'number' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    rowCount: 50,
    lastRunAt: daysAgo(2),
    createdAt: daysAgo(60),
  },
  {
    id: 'rpt_005',
    name: 'Operations Efficiency',
    category: 'operations',
    description: 'Operational KPIs including cycle times, error rates, and throughput.',
    columns: [
      { key: 'metric', label: 'Metric', type: 'string' },
      { key: 'value', label: 'Value', type: 'number' },
      { key: 'target', label: 'Target', type: 'number' },
      { key: 'trend', label: 'Trend', type: 'string' },
    ],
    rowCount: 32,
    lastRunAt: daysAgo(3),
    createdAt: daysAgo(45),
  },
  {
    id: 'rpt_006',
    name: 'Customer Acquisition Report',
    category: 'sales',
    description: 'Lead sources, conversion funnels, and CAC by channel.',
    columns: [
      { key: 'channel', label: 'Channel', type: 'string' },
      { key: 'leads', label: 'Leads', type: 'number' },
      { key: 'qualified', label: 'Qualified', type: 'number' },
      { key: 'converted', label: 'Converted', type: 'number' },
      { key: 'cac', label: 'CAC', type: 'currency' },
    ],
    rowCount: 60,
    lastRunAt: daysAgo(4),
    createdAt: daysAgo(30),
  },
  {
    id: 'rpt_007',
    name: 'Budget vs Actuals',
    category: 'finance',
    description: 'Departmental budget comparisons and variance analysis.',
    columns: [
      { key: 'department', label: 'Department', type: 'string' },
      { key: 'budget', label: 'Budget', type: 'currency' },
      { key: 'actuals', label: 'Actuals', type: 'currency' },
      { key: 'variance', label: 'Variance', type: 'currency' },
    ],
    rowCount: 28,
    lastRunAt: daysAgo(5),
    createdAt: daysAgo(20),
  },
  {
    id: 'rpt_008',
    name: 'Warehouse Utilization',
    category: 'operations',
    description: 'Space utilization, throughput, and cost per unit by facility.',
    columns: [
      { key: 'warehouse', label: 'Warehouse', type: 'string' },
      { key: 'capacity', label: 'Capacity', type: 'number' },
      { key: 'utilized', label: 'Utilized', type: 'number' },
      { key: 'utilization', label: 'Utilization %', type: 'number' },
      { key: 'costPerUnit', label: 'Cost/Unit', type: 'currency' },
    ],
    rowCount: 12,
    lastRunAt: daysAgo(1),
    createdAt: daysAgo(15),
  },
]
