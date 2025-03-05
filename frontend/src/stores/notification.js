import { authenticatedApi, Method } from '@/api'
import { defineStore } from 'pinia'
import { NotificationStatus } from 'shared'
import { computed, ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  const unreadNotifications = computed(() =>
    notifications.value.filter((n) => n.status === NotificationStatus.UNREAD)
  )

  const fetchNotifications = async () => {
    const res = await authenticatedApi('notifications/')
    const isSuccess = res.status < 400

    if (isSuccess) {
      notifications.value = res.data.notifications
    }

    return isSuccess
  }

  const notifFromSocket = (notification) => {
    notifications.value.unshift(notification)
  }

  const updateNotification = async (notification, id) => {
    if (Object.keys(notification).includes('id')) delete notification.id
    if (Object.keys(notification).includes('createdAt'))
      delete notification.createdAt
    if (Object.keys(notification).includes('updatedAt'))
      delete notification.updatedAt

    const res = await authenticatedApi(
      `notifications/${id}`,
      Method.PUT,
      notification
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
    unreadNotifications,

    notifFromSocket,
    fetchNotifications,
    updateNotification
  }
})
