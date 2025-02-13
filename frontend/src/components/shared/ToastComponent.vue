<template>
  <div class="flex flex-col gap-3 fixed top-0 right-0 p-2 z-[60]">
    <button class="btn" @click="simulateToast" v-if="isTesting">
      Test me!
    </button>
    <div
      v-for="(toast, ndx) in toasts"
      :key="ndx"
      :class="[
        toastSettings[toast.type].class,
        toast.show ? 'fade-in' : 'fade-out'
      ]"
      @animationend="removeToast(toast)"
      class="pl-4 pr-2 border-2 rounded-md flex gap-3 py-3 items-center"
    >
      <div
        :class="toastSettings[toast.type].class"
        class="rounded-full border-2"
      >
        <img
          class="w-5 h-5 text-green-500"
          :src="toastSettings[toast.type].icon"
          alt="icon.svg"
        />
      </div>
      <p class="flex-1" :class="toastSettings[toast.type].textStyle">
        {{ toast.message }}
      </p>

      <button>
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

// icons
import success from '@/assets/icons/toast/check.svg'
import times from '@/assets/icons/toast/times.svg'
import info from '@/assets/icons/toast/info.svg'
import warning from '@/assets/icons/toast/warning.svg'

const isTesting = ref(false)

const toastSettings = {
  [ToastTypes.SUCCESS]: {
    textStyle: 'text-green-400',
    class: 'bg-green-100 text-green-400 border-green-400',
    icon: success,
    fill: 'fil'
  },
  [ToastTypes.ERROR]: {
    class: 'bg-red-100 text-red-400 border-red-400',
    icon: times
  },
  [ToastTypes.INFO]: {
    class: 'bg-blue-100 text-blue-400 border-blue-400',
    icon: info
  },
  [ToastTypes.WARNING]: {
    class: 'bg-yellow-100 text-yellow-400 border-yellow-400',
    icon: warning
  }
}

const toasts = ref([])

/** ================================================
 * EVENTS
 ** ================================================*/
Event.on(EventEnum.TOAST_MESSAGE, (data) => {
  data.id = Math.random().toString(8).slice(2)
  data.show = true
  data.animationend = false
  data.interval = setTimeout(
    () => {
      const toast = toasts.value.find((toast) => toast.id === data.id)
      if (toast) {
        toast.show = false
        clearTimeout(toast.interval)
      }
    },
    data.duration ? data.duration : 3000
  )
  toasts.value.push(data)
})

/** ================================================
 * METHODS
 ** ================================================*/
const removeToast = (toast) => {
  if (!toast.show) {
    let t = toasts.value.find((t) => t.id === toast.id)
    t.animationend = true
  }

  // check if all toast status animationend is true
  if (!toasts.value.some((t) => !t.animationend)) {
    toasts.value = []
  }
}

// testing
const simulateToast = () => {
  Event.emit(EventEnum.TOAST_MESSAGE, {
    type: ToastTypes.ERROR,
    message: 'Failed to created service! ' + toasts.value.length,
    duration: 3000
  })
}
</script>

<style scoped>
.fade-in {
  animation: fade-in 0.8s ease-in-out forwards;
}

.fade-out {
  animation: fade-out 0.8s ease-in-out forwards;
}
</style>
