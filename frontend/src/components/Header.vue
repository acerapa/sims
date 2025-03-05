<template>
  <div class="header-container">
    <div class="header-wrap">
      <p class="text-xl font-bold">Ram Tech Ventures</p>
      <button
        class="notification-btn"
        @click.stop="showNotifications = !showNotifications"
      >
        <span
          v-if="unreadNotifications.length"
          class="absolute bg-red-500 text-white px-2 -top-1.5 right-0 rounded-lg"
        >
          {{ unreadNotifications.length }}
        </span>
        <img class="w-8" :src="NotificationBell" alt="notification-icon.png" />
      </button>

      <div
        class="cont notification-dropdown"
        v-if="showNotifications"
        @click.stop
      >
        <div class="flex justify-between items-start">
          <p>Notifications 🔔</p>
          <button
            class="text-xl leading-none"
            @click="showNotifications = false"
          >
            &times;
          </button>
        </div>

        <div class="list text-sm mt-3 flex flex-col">
          <div
            class="notification-row"
            :class="notif.status === NotificationStatus.UNREAD && 'bg-blue-200'"
            v-for="notif in notifications"
            :key="notif"
            @click="onClickNotification(notif)"
          >
            <p class="text-sm font-semibold">{{ notif.title }}</p>
            <span class="text-xs font-thin">{{ notif.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import NotificationBell from '@/assets/icons/notification-bell.png'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { useNotificationStore } from '@/stores/notification'
import { NotificationStatus } from 'shared'

const route = useRoute()
const appStore = useAppStore()
const { notifications, unreadNotifications, updateNotification } =
  useNotificationStore()

const showNotifications = ref(false)

/** ================================================
 * EVENTS
 ** ================================================*/
Event.on(EventEnum.GLOBAL_CLICK, () => {
  showNotifications.value = false
})

/** ================================================
 * COMPUTED
 ** ================================================*/
// currently changing the design, This part might to be usable in the next update
const title = computed(() => {
  let t = route.meta.title

  if (!t) {
    if (appStore.currentNav && appStore.currentNav.includes_active) {
      t = appStore.currentNav.includes_active.includes(route.name)
        ? t
        : appStore.currentNav.text
    } else if (appStore.currentNav && !appStore.currentNav.includes_active) {
      t = appStore.currentNav.text
    }
  }

  return t
})

/** ================================================
 * METHODS
 ** ================================================*/
const onClickNotification = async (notification) => {
  if (notification.status === NotificationStatus.READ) return
  notification.status = NotificationStatus.READ
  await updateNotification(notification, notification.id)
}
</script>

<style scoped>
.header-container {
  @apply bg-white shadow h-15 px-5 sticky top-0 z-20;
}

.header-wrap {
  @apply flex justify-between items-center h-full relative;
}

.notification-btn {
  @apply relative mr-5 px-3;
}

.notification-dropdown {
  @apply absolute right-0 top-20 !rounded min-w-96;
}

.notification-row {
  @apply py-1.5 border-b last:border-b-0 cursor-pointer hover:bg-blue-100 -mx-4 px-4;
}
</style>
