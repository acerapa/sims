<template>
  <div class="bg-white shadow h-15 px-5 sticky top-0 z-20">
    <div class="flex justify-between items-center h-full relative">
      <p class="text-xl font-bold">Ram Tech Ventures</p>
      <button class="relative mr-5 px-3" @click.stop="showNotifications = true">
        <span
          v-if="notifications.length"
          class="absolute bg-red-500 text-white px-2 -top-1.5 right-0 rounded-lg"
        >
          {{ notifications.length }}
        </span>
        <img class="w-8" :src="NotificationBell" alt="notification-icon.png" />
      </button>

      <div
        class="cont absolute right-0 top-20 !rounded min-w-96"
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

        <div
          class="list text-sm mt-3 flex flex-col [&>p]:cursor-pointer [&>p]:py-2 [&>p]:border-t"
        >
          <p v-for="notif in notifications" :key="notif">{{ notif }}</p>
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

const route = useRoute()
const appStore = useAppStore()

const showNotifications = ref(false)

const notifications = [
  'Hello! we have some upcoming products!',
  'Product a is almost out of stock'
]

/** ================================================
 * EVENTS
 ** ================================================*/
Event.on(EventEnum.GLOBAL_CLICK, () => {
  showNotifications.value = false
})

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
</script>
