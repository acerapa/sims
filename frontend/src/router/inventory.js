import Product from '@/views/Inventory/Product.vue'
import { InventoryConst } from '../const/route.constants'
export default [
  {
    path: '/inventory',
    name: InventoryConst.INVENTORY,
    component: () => import('@/layout/NavLayout.vue'),
    redirect: {
      name: InventoryConst.PRODUCTS
    },
    children: [
      {
        path: '/inventory-stock-status',
        name: InventoryConst.INVENTORY_STOCK_STATUS,
        component: () =>
          import('@/views/Inventory/InventoryStockStatusPage.vue'),
        meta: {
          title: 'Inventory Stock Status Page',
          requiresAuth: true
        }
      },
      {
        path: '/physical-inventory-form',
        name: InventoryConst.PHYSICAL_INVENTORY_FORM,
        component: () => import('@/views/Inventory/PhysicalInventoryForm.vue'),
        meta: {
          title: 'Physical Inventory',
          requiresAuth: true
        }
      },
      {
        path: '/products',
        name: InventoryConst.PRODUCTS,
        component: Product,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/product/form',
        name: InventoryConst.PRODUCT_FORM,
        component: () => import('@/views/product/product-form.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/services',
        name: InventoryConst.SERVICES,
        component: () => import('@/views/Inventory/Services.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/physical-inventory',
        name: InventoryConst.PHYSICAL_INVENTORY,
        component: () => import('@/views/Inventory/PhysicalInventory.vue'),
        meta: {
          title: 'Physical Inventories',
          requiresAuth: true
        }
      },
      {
        path: '/physical-inventory-adjustment-form',
        name: InventoryConst.PHYSICAL_INVENTORY_ADJUSTMENT_FORM,
        component: () =>
          import('@/views/Inventory/PhysicalInventoryAdjustmentForm.vue'),
        meta: {
          title: 'Physical Inventory Adjustment Form',
          requiresAuth: true
        }
      }
    ]
  }
]
