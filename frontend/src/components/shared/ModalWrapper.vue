<template>
  <div class="overlay"></div>
  <div
    class="fixed w-full max-h-[calc(100vh-80px)] max-w-[614px] rounded-xl top-10 left-1/2 -translate-x-1/2 p-4 z-[70] bg-white"
    :class="props.modalClass"
  >
    <div class="flex justify-between items-center">
      <p class="font-semibold text-xl">{{ props.title }}</p>
      <img
        src="@/assets/icons/close.svg"
        alt="close"
        class="cursor-pointer"
        @click="showModal = false"
      />
    </div>
    <form :action="props.action" @submit.prevent>
      <div class="max-h-[calc(100vh-241.33px)] h-auto overflow-y-auto w-full">
        <slot></slot>
      </div>
    </form>
    <div
      class="flex gap-3 mt-10 mx-auto"
      :class="props.hasDelete ? 'justify-between' : 'justify-center'"
    >
      <button
        class="btn-danger-outline"
        v-if="props.hasDelete"
        @click="emit('delete')"
      >
        Delete
      </button>
      <div class="flex gap-3">
        <button class="btn-gray-outline" @click="showModal = false">
          Cancel
        </button>
        <button class="btn" @click="onSave">{{ props.saveBtn }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  action: String,
  saveBtn: {
    type: String,
    default: 'Save'
  },
  modalClass: {
    type: String,
    default: ''
  },
  hasDelete: {
    type: Boolean,
    default: false
  }
})

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      showModal.value = false
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      showModal.value = false
    }
  })
})

const showModal = defineModel()

const emit = defineEmits(['submit', 'delete'])

const onSave = () => {
  emit('submit')
}
</script>

<style scoped>
.overlay {
  @apply bg-black opacity-45 fixed top-0 left-0 w-screen h-screen z-[70];
}
</style>
