<template>
  <div class="flex flex-col gap-3 absolute bottom-0 right-0 p-2">
    <div
      v-for="(toast, ndx) in toasts"
      :key="ndx"
      class="toast pl-3 pr-1 border-2 border-green-400 rounded bg-green-100 flex gap-3"
    >
      <div :class="toastSettings[toast.type].class">
        <span class="block">
          {{ toastSettings[toast.type].icon }}
        </span>
      </div>
      <p class="flex-1" :class="toastSettings[toast.type].textStyle">
        {{ toast.message }}
      </p>

      <button class="">
        <div class="w-4 h-4 rounded-full bg-gray-300 p-0.5">
          <img src="@/assets/icons/plus.svg" alt="Plus" class="rotate-45" />
        </div>
      </button>
    </div>
  </div>
</template>
<script setup>
import { EventEnum } from '@/data/event'
import { ToastTypes } from '@/data/types'
import Event from '@/event'
import { ref } from 'vue'

const toastSettings = {
  [ToastTypes.SUCCESS]: {
    textStyle: 'text-green-400',
    class: 'bg-green-100 text-green-400 border-green-400',
    icon: String.fromCharCode(parseInt('02713', 16))
  },
  [ToastTypes.ERROR]: {
    class: 'bg-red-100 text-red-400 border-red-400',
    icon: String.fromCharCode(parseInt('02715', 16))
  },
  [ToastTypes.INFO]: {
    class: 'bg-blue-100 text-blue-400 border-blue-400',
    icon: String.fromCharCode(parseInt('00069', 16))
  },
  [ToastTypes.WARNING]: {
    class: 'bg-yellow-100 text-yellow-400 border-yellow-400',
    icon: String.fromCharCode(parseInt('026A0', 16))
  }
}

const toasts = ref([])

/** ================================================
 * EVENTS
 ** ================================================*/
Event.on(EventEnum.TOAST_MESSAGE, (data) => {
  data.id = Math.random().toString(8).slice(2)
  data.interval = setTimeout(
    () => {
      const index = toasts.value.findIndex((toast) => toast.id === data.id)
      if (index > -1) {
        clearTimeout(toasts.value[index].interval)
        toasts.value.splice(index, 1)
      }
    },
    data.duration ? data.duration : 3000
  )
  toasts.value.push(data)
})
</script>

<style scoped>
.toast {
  animation: fade-in 0.8s ease-in-out;
}
</style>
