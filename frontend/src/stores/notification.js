import { authenticatedApi, Method } from '@/api'
import { defineStore } from 'pinia'
import { DateHelpers, NotificationStatus, NotificationType } from 'shared'
import { computed, ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  const unreadNotification = computed(() =>
    notifications.value.filter((n) => n.status === NotificationStatus.UNREAD)
  )

  const productNotification = computed(() =>
    notifications.value.filter((n) => n.type == NotificationType.PRODUCT)
  )

  const timeBasedNotif = computed(() => {
    const todayNotification = notifications.value.filter((n) => {
      const startOfDay = DateHelpers.startOfDay(new Date())
      const endOfDay = DateHelpers.endOfDay(new Date())
      const createdAt = new Date(n.createdAt)

      return startOfDay <= createdAt && endOfDay >= createdAt
    })

    const yesterdayNotification = notifications.value.filter((n) => {
      const startOfDay = DateHelpers.startOfDay(DateHelpers.yesterday())
      const endOfDay = DateHelpers.endOfDay(DateHelpers.yesterday())
      const createdAt = new Date(n.createdAt)

      return startOfDay <= createdAt && endOfDay >= createdAt
    })

    const thisWeekNotification = notifications.value.filter((n) => {
      const startOfWeek = DateHelpers.getFirstDayOfWeek(new Date())
      const endOfWeek = DateHelpers.endOfDay(
        DateHelpers.getLastDayOfWeek(new Date())
      )
      const createdAt = new Date(n.createdAt)

      const currentFiltered = [...todayNotification, ...yesterdayNotification]

      const isAlreadyInCurrentFiltered = currentFiltered.some(
        (currentFilteredN) => currentFilteredN.id === n.id
      )

      return (
        startOfWeek <= createdAt &&
        endOfWeek >= createdAt &&
        !isAlreadyInCurrentFiltered
      )
    })

    const olderNotifications = notifications.value.filter((n) => {
      const endOfWeek = DateHelpers.endOfDay(
        DateHelpers.getLastDayOfWeek(new Date())
      )

      const createdAt = new Date(n.createdAt)

      const isAlreadyInCurrentFiltered = [
        ...todayNotification,
        ...yesterdayNotification,
        ...thisWeekNotification
      ].some((currentFilteredN) => currentFilteredN.id === n.id)

      return endOfWeek > createdAt && !isAlreadyInCurrentFiltered
    })

    return {
      Today: todayNotification,
      Yesterday: yesterdayNotification,
      'This week': thisWeekNotification,
      Older: olderNotifications
    }
  })

  const fetchNotifications = async () => {
    const res = await authenticatedApi('notifications/')
    const isSuccess = res.status < 400

    if (isSuccess) {
      notifications.value = res.data.notifications
    }

    return isSuccess
  }

  const notifFromSocket = (notification) => {
    notifications.value = [notification, ...notifications.value]
  }

  const updateNotification = async (notification, id) => {
    let notificationToUpdate = {
      title: notification.title,
      description: notification.description,
      status: notification.status,
      route: notification.route
    }

    const res = await authenticatedApi(
      `notifications/${id}`,
      Method.PUT,
      notificationToUpdate
    )

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (notifications.value.length) {
        const index = notifications.value.findIndex((n) => n.id == id)
        notifications.value[index] = res.data.notification
      }
    }

    return isSuccess
  }

  return {
    notifications,
    timeBasedNotif,
    unreadNotification,
    productNotification,

    notifFromSocket,
    fetchNotifications,
    updateNotification
  }
})
