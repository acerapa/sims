import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

import commonRoutes from './common'
import reportRoutes from './report'
import inventoryRoutes from './inventory'
import settingsRoutes from './settings'
import transferRoutes from './transfer'
import salesRoutes from './sales'
import purchaseRoutes from './purchase'
import { CommonConst } from '../const/route.constants'
import Event from '@/event'
import { EventEnum } from '@/data/event'

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

const { getAuthUser } = useAuth()

router.beforeEach(async (to, from, next) => {
  // Raise Event that route is changing
  Event.emit(EventEnum.ROUTE_CHANGE, { to, from })

  const isAuth = await getAuthUser()
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
