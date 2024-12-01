export default [
  {
    name: 'sales',
    path: '/sales',
    component: () => import('@/layout/NavLayout.vue'),
    redirect: {
      name: 'item-details'
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
      }
    ]
  }
]
