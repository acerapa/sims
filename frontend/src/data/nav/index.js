import dashboard from '@/assets/icons/dashboard.svg'
import inventory from '@/assets/icons/inventory.svg'
import reports from '@/assets/icons/reports.svg'
import employees from '@/assets/icons/employees.svg'
import settings from '@/assets/icons/settings.svg'
import outlineDot from '@/assets/icons/outline-dot.svg'
import transfer from '@/assets/icons/transfer.png'
import sales from '@/assets/icons/sales.png'

export default [
  {
    text: 'Dashboard',
    route: 'dashboard',
    icon: dashboard
  },
  {
    text: 'Inventory Management',
    route: 'inventory',
    icon: inventory,
    children: [
      {
        text: 'Products',
        route: 'products',
        icon: outlineDot,
        includes_active: ['product-form']
      },
      {
        text: 'Services',
        route: 'services',
        icon: outlineDot
      },
      {
        text: 'Inventory Stock Status',
        route: 'inventory-stock-status',
        icon: outlineDot
      }
    ]
  },
  {
    text: 'Purchase Management',
    route: 'purchase',
    icon: inventory,
    children: [
      {
        text: 'Purchase Order',
        route: 'purchase-order',
        icon: outlineDot,
        includes_active: ['purchase-order-create']
      },
      {
        text: 'Vendor management',
        route: 'vendors',
        icon: outlineDot
      }
    ]
  },
  {
    text: 'Sales & Orders',
    route: 'sales',
    icon: sales,
    children: [
      {
        text: 'Sales Order',
        route: 'sales-order',
        icon: outlineDot,
        includes_active: ['sales-order-form']
      },
      {
        text: 'Customers',
        route: 'customers',
        icon: outlineDot
      },
      {
        text: 'Item Details',
        route: 'item-details',
        icon: outlineDot
      }
    ]
  },
  {
    text: 'Stock Transfers',
    route: 'transfer',
    icon: transfer,
    children: [
      {
        text: 'STR List',
        route: 'str-list',
        icon: outlineDot,
        includes_active: ['str-form']
      },
      {
        text: 'IBRR List',
        route: 'ibrr-list',
        icon: outlineDot,
        includes_active: ['ibrr-form']
      },
      {
        text: 'RMA List',
        route: 'rma-list',
        icon: outlineDot,
        includes_active: ['rma-form']
      },
      {
        text: 'PO to Fix list',
        route: 'fix-asset-list',
        icon: outlineDot,
        includes_active: ['fix-asset-form']
      }
    ]
  },
  {
    text: 'Reports',
    route: 'reports',
    icon: reports,
    children: [
      {
        text: 'Physical Inventories',
        route: 'physical-inventory',
        icon: outlineDot
      }
    ]
  },
  {
    text: 'Employees',
    route: 'employees',
    icon: employees
  },
  {
    text: 'Settings',
    route: 'setting',
    icon: settings,
    children: [
      {
        text: 'Branches',
        route: 'branches',
        icon: outlineDot
      },
      {
        text: 'Account Settings',
        route: 'account-settings',
        icon: outlineDot
      },
      {
        text: 'Product Settings',
        route: 'product-settings',
        icon: outlineDot
      }
    ]
  }
]
