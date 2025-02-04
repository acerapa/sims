export default [
  {
    name: 'sales',
    path: '/sales',
    component: () => import('@/layout/NavLayout.vue'),
    redirect: {
      name: 'sales-order'
    },
    children: [
      {
        name: 'item-details',
        path: '/item-details',
        component: () => import('@/views/sales/ItemDatails.vue'),
        meta: {
          title: 'Item Details',
          requiresAuth: true
        }
      },
      {
        name: 'sales-order-form',
        path: '/sales-order-form',
        component: () => import('@/views/sales/SalesOrderForm.vue'),
        meta: {
          title: 'Sales Order Form',
          requiresAuth: true
        }
      },
      {
        name: 'sales-order',
        path: '/sales-order',
        component: () => import('@/views/sales/SalesOrder.vue'),
        meta: {
          title: 'Sales Order',
          requiresAuth: true
        }
      },
      {
        path: '/customers',
        name: 'customers',
        component: () => import('@/views/sales/Customer.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]
