export default [
  {
    path: '/',
    component: () => import('@/layout/NavLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/employees',
        name: 'employees',
        component: () => import('@/views/Employee.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/product-list',
        name: 'product-list',
        component: () => import('@/views/public/ProductList.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/demo',
        name: 'demo',
        component: () => import('@/views/demo.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/product-list',
    name: 'product-list',
    component: () => import('@/views/public/ProductList.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Sign-in.vue')
  }
]
