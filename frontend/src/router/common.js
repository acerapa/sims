import Product from '@/views/Product.vue'
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
        component: () => import('@/views/Services.vue'),
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
