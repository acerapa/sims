<template>
  <div class="cont min-w-80 h-fit !py-0">
    <p class="my-3">📣 Alerts and Notifications</p>
    <hr class="-mx-4" />
    <div class="flex flex-col">
      <div
        v-for="notif in productNotification"
        class="product-notification-row"
      >
        <div class="col-span-4">
          <p class="text-sm font-semibold">{{ notif.title }}</p>
          <p class="text-xs text-gray-400">{{ notif.description }}</p>
        </div>
        <p class="notification-date">
          <!-- This should be the format: Mar 25 2025 -->
          {{
            new Date(notif.createdAt).toLocaleString('default', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            })
          }}
        </p>
      </div>
    </div>
    <p v-if="!productNotification.length" class="text-sm text-center my-6">
      No Alerts and Notifications
    </p>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'

const notificationStore = useNotificationStore()
const { productNotification } = storeToRefs(notificationStore)
</script>

<style scoped>
.product-notification-row {
  @apply grid grid-cols-5 py-3 hover:bg-blue-100 cursor-pointer -mx-4 px-4 last:rounded-b-xl;
}

.notification-date {
  @apply font-bold text-xs col-span-1 text-right text-gray-500;
}
</style>
