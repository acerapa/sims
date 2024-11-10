export default [
  {
    path: '/settings',
    name: 'setting',
    redirect: {
      name: 'branches',
    },
    component: () => import('@/layout/NavLayout.vue'),
    children: [
      {
        path: 'product-settings',
        name: 'product-settings',
        component: () => import('@/views/Settings/ProductSettings.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'account-settings',
        name: 'account-settings',
        component: () => import('@/views/Settings/Account.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'branches',
        name: 'branches',
        component: () => import('@/views/Settings/Branch.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];
