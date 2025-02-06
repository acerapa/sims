import { CommonConst } from './constants/route.constants'

export default [
  {
    path: '/',
    component: () => import('@/layout/NavLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: CommonConst.DASHBOARD,
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/employees',
        name: CommonConst.EMPLOYEES,
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
    name: CommonConst.LOGIN,
    component: () => import('@/views/Sign-in.vue')
  }
]
