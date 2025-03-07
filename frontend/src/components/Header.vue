<template>
  <div class="header-container">
    <div class="header-wrap">
      <p class="text-xl font-bold">Ram Tech Ventures</p>
      <button
        class="notification-btn"
        @click.stop="showNotifications = !showNotifications"
      >
        <span
          v-if="notificationStore.unreadNotification.length"
          class="absolute bg-red-500 text-white px-2 -top-1.5 right-0 rounded-lg"
        >
          {{ notificationStore.unreadNotification.length }}
        </span>
        <img class="w-8" :src="NotificationBell" alt="notification-icon.png" />
      </button>

      <div
        class="cont notification-dropdown"
        v-if="showNotifications"
        @click.stop
      >
        <div class="notification-header">
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
            class=""
            v-for="timedNotifKey in Object.keys(timeBasedNotif)"
            :key="timedNotifKey"
          >
            <p
              class="text-xs text-gray-500 py-3 bg-gray-100 px-4 -mx-4"
              v-if="timeBasedNotif[timedNotifKey].length"
            >
              {{ timedNotifKey }}
            </p>
            <div
              v-if="timeBasedNotif[timedNotifKey].length"
              class="notification-row"
              :class="
                notif.status === NotificationStatus.UNREAD && 'bg-blue-200'
              "
              v-for="notif in timeBasedNotif[timedNotifKey]"
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
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import NotificationBell from '@/assets/icons/notification-bell.png'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { useNotificationStore } from '@/stores/notification'
import { NotificationStatus } from 'shared'
import { useNotificationSocket } from '@/composables/useNotifiacationSocket'
import { storeToRefs } from 'pinia'

const route = useRoute()
const appStore = useAppStore()
const notificationStore = useNotificationStore()
const { timeBasedNotif } = storeToRefs(notificationStore)

const { socket } = useNotificationSocket()

const showNotifications = ref(false)

/** ================================================
 * SOCKET EVENTS
 ** ================================================*/
const initializeSocketEvents = () => {
  socket.value.on('new-notification', (notification) => {
    notificationStore.notifFromSocket(notification)
  })
}

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
  await notificationStore.updateNotification(notification, notification.id)
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(() => {
  initializeSocketEvents()
})

/** ================================================
 * WATCHERS
 * ================================================*/
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

.notification-header {
  @apply flex justify-between items-start -mx-4 px-4 -mt-4 py-4 sticky top-0 bg-white;
}

.notification-dropdown {
  @apply absolute right-0 top-20 !rounded !pt-0 min-w-96 max-h-[500px] overflow-y-auto;
}

.notification-row {
  @apply py-1.5 border-b last:border-b-0 cursor-pointer hover:bg-blue-100 -mx-4 px-4;
}
</style>
