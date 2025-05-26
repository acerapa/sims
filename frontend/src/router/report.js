export default [
  {
    path: '/',
    name: 'reports',
    component: () => import('@/layout/NavLayout.vue'),
    redirect: {
      name: 'physical-inventory'
    },
    children: []
  }
]
