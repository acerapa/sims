import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/stores/auth'

import commonRoutes from './common'
import reportRoutes from './report'
import inventoryRoutes from './inventory'
import settingsRoutes from './settings'
import transferRoutes from './transfer'
import salesRoutes from './sales'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...commonRoutes,
    ...inventoryRoutes,
    ...settingsRoutes,
    ...reportRoutes,
    ...transferRoutes,
    ...salesRoutes
  ]
})

router.beforeEach(async (to, from, next) => {
  const isAuth = await isAuthenticated()

  if (to.meta.requiresAuth) {
    if (isAuth) {
      next()
    } else {
      if (to.name == 'login') {
        next()
        return
      } else {
        next({ name: 'login' })
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
