import { authenticatedApi } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  const fetchNotifications = async () => {
    const res = await authenticatedApi('notifications/')
    const isSuccess = res.status < 400

    if (isSuccess) {
      notifications.value = res.data
    }

    return isSuccess
  }

  const getNotifications = async () => {
    if (!notifications.value.length) {
      await fetchNotifications()
    }

    return notifications.value
  }

  return {
    notifications,
    getNotifications,
    fetchNotifications
  }
})
