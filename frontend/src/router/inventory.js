import Product from '@/views/Inventory/Product.vue'
export default [
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('@/layout/NavLayout.vue'),
    redirect: {
      name: 'products'
    },
    children: [
      {
        path: '/inventory-stock-status',
        name: 'inventory-stock-status',
        component: () =>
          import('@/views/Inventory/InventoryStockStatusPage.vue'),
        meta: {
          title: 'Inventory Stock Status Page',
          requiresAuth: true
        }
      },
      {
        path: '/physical-inventory-details/:id',
        name: 'physical-inventory-details',
        component: () =>
          import('@/views/Inventory/PhysicalInventoryDetails.vue'),
        meta: {
          title: 'Physical Inventory',
          requiresAuth: true
        }
      },
      {
        path: '/products',
        name: 'products',
        component: Product,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/product/form',
        name: 'product-form',
        component: () => import('@/views/product/product-form.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/services',
        name: 'services',
        component: () => import('@/views/Inventory/Services.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]
