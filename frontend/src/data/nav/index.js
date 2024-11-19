import dashboard from '@/assets/icons/dashboard.svg'
import inventory from '@/assets/icons/inventory.svg'
import vendors from '@/assets/icons/vendors.svg'
import customers from '@/assets/icons/customers.svg'
import products from '@/assets/icons/products.svg'
import reports from '@/assets/icons/reports.svg'
import employees from '@/assets/icons/employees.svg'
import settings from '@/assets/icons/settings.svg'
import outlineDot from '@/assets/icons/outline-dot.svg'
import transfer from '@/assets/icons/transfer.png'

export default [
  {
    text: 'Dashboard',
    route: 'dashboard',
    icon: dashboard
  },
  {
    text: 'Inventory',
    route: 'inventory',
    icon: inventory,
    children: [
      {
        text: 'Purchase Order',
        route: 'purchase-order',
        icon: outlineDot,
        includes_active: ['purchase-order-create']
      },
      {
        text: 'My Inventory',
        route: 'my-inventory',
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
    text: 'Transfer Stocks',
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
    text: 'Vendors/Suppliers',
    route: 'vendors',
    icon: vendors
  },
  {
    text: 'Customers',
    route: 'customers',
    icon: customers
  },
  {
    text: 'Products',
    route: 'products',
    icon: products
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
