import { SettingConst } from '../const/route.constants'

export default [
  {
    path: '/settings',
    name: SettingConst.SETTING,
    redirect: {
      name: SettingConst.BRANCHES
    },
    component: () => import('@/layout/NavLayout.vue'),
    children: [
      {
        path: 'product-settings',
        name: SettingConst.PRODUCT_SETTINGS,
        component: () => import('@/views/Settings/ProductSettings.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'account-settings',
        name: SettingConst.ACCOUNT_SETTINGS,
        component: () => import('@/views/Settings/Account.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'branches',
        name: SettingConst.BRANCHES,
        component: () => import('@/views/Settings/Branch.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]
