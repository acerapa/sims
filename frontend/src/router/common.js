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
        path: '/vendors',
        name: 'vendors',
        component: () => import('@/views/Vendor.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/customers',
        name: 'customers',
        component: () => import('@/views/Customer.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/products',
        name: 'products',
        component: () => import('@/views/Product.vue'),
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
    path: '/login',
    name: 'login',
    component: () => import('@/views/Sign-in.vue')
  }
]
