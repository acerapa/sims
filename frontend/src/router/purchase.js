export default [
  {
    path: '/purchase',
    name: 'purchase',
    component: () => import('@/layout/NavLayout.vue'),
    redirect: {
      name: 'purchase-order'
    },
    children: [
      {
        path: '/purchase-order',
        name: 'purchase-order',
        component: () => import('@/views/purchase/PurchaseOrder.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/purchase-order-create',
        name: 'purchase-order-create',
        component: () => import('@/views/purchase/PurchaseOrderForm.vue'),
        meta: {
          requiresAuth: true,
          title: 'Purchase Order Form'
        }
      },
      {
        path: '/purchase-receive-order/:id',
        name: 'purchase-receive-order',
        component: () => import('@/views/purchase/ReceiveOrder.vue'),
        meta: {
          title: 'Receive Order',
          requiresAuth: true
        }
      },
      {
        path: '/vendors',
        name: 'vendors',
        component: () => import('@/views/purchase/Vendor.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]
