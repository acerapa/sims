import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/stores/auth'

import commonRoutes from './common'
import reportRoutes from './report'
import inventoryRoutes from './inventory'
import settingsRoutes from './settings'
import transferRoutes from './transfer'
import salesRoutes from './sales'
import purchaseRoutes from './purchase'
import { CommonConst } from './constants/route.constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...commonRoutes,
    ...inventoryRoutes,
    ...settingsRoutes,
    ...reportRoutes,
    ...transferRoutes,
    ...salesRoutes,
    ...purchaseRoutes
  ]
})

router.beforeEach(async (to, from, next) => {
  const isAuth = await isAuthenticated()

  if (to.meta.requiresAuth) {
    if (isAuth) {
      next()
    } else {
      if (to.name == CommonConst.LOGIN) {
        next()
        return
      } else {
        next({ name: CommonConst.LOGIN })
        return
      }
    }
  } else {
    if (isAuth) {
      next(from)
    } else {
      next()
    }
  }
})

export default router
