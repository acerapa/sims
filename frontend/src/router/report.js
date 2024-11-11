export default [
  {
    path: '/',
    name: 'reports',
    component: () => import('@/layout/NavLayout.vue'),
    redirect: {
      name: 'physical-inventory'
    },
    children: [
      {
        path: '/physical-inventory',
        name: 'physical-inventory',
        component: () => import('@/views/Inventory/PhysicalInventory.vue'),
        meta: {
          title: 'Physical Inventories',
          requiresAuth: true
        }
      }
    ]
  }
]
