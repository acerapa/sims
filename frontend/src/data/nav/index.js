import dashboard from '@/assets/icons/dashboard.svg'
import inventory from '@/assets/icons/inventory.svg'
import reports from '@/assets/icons/reports.svg'
import employees from '@/assets/icons/employees.svg'
import settings from '@/assets/icons/settings.svg'
import outlineDot from '@/assets/icons/outline-dot.svg'
import transfer from '@/assets/icons/transfer.png'
import sales from '@/assets/icons/sales.png'
import {
  InventoryConst,
  PurchaseConst,
  SettingConst,
  TransferConst
} from '@/const/route.constants'

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
        route: InventoryConst.PRODUCTS,
        icon: outlineDot,
        includes_active: [InventoryConst.PRODUCT_FORM]
      },
      {
        text: 'Services',
        route: InventoryConst.SERVICES,
        icon: outlineDot
      },
      {
        text: 'Inventory Stock Status',
        route: InventoryConst.INVENTORY_STOCK_STATUS,
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
        route: PurchaseConst.PURCHASE_ORDER,
        icon: outlineDot,
        includes_active: [PurchaseConst.PURCHASE_ORDER_FORM]
      },
      {
        text: 'Vendor management',
        route: PurchaseConst.VENDORS,
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
    route: TransferConst.TRANSFER,
    icon: transfer,
    children: [
      {
        text: 'STR List',
        route: TransferConst.STR_LIST,
        icon: outlineDot,
        includes_active: [TransferConst.STR_FORM]
      },
      {
        text: 'IBRR List',
        route: TransferConst.IBRR_LIST,
        icon: outlineDot,
        includes_active: [TransferConst.IBRR_FORM]
      },
      {
        text: 'RMA List',
        route: TransferConst.RMA_LIST,
        icon: outlineDot,
        includes_active: [TransferConst.RMA_FORM]
      },
      {
        text: 'PO to Fix list',
        route: TransferConst.FIX_ASSET_LIST,
        icon: outlineDot,
        includes_active: [TransferConst.FIX_ASSET_FORM]
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
    route: SettingConst.SETTING,
    icon: settings,
    children: [
      {
        text: 'Branches',
        route: SettingConst.BRANCHES,
        icon: outlineDot
      },
      {
        text: 'Account Settings',
        route: SettingConst.ACCOUNT_SETTINGS,
        icon: outlineDot
      },
      {
        text: 'Product Settings',
        route: SettingConst.PRODUCT_SETTINGS,
        icon: outlineDot
      }
    ]
  }
]
