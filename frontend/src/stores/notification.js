import { authenticatedApi } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  const fetchNotifications = async () => {
    const res = await authenticatedApi('notifications/')
    const isSuccess = res.status < 400

    if (isSuccess) {
      notifications.value = res.data.notifications
    }

    return isSuccess
  }

  return {
    notifications,
    fetchNotifications
  }
})
