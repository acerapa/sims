<template>
  <div
    class="bg-white rounded-lg absolute right-12 flex flex-col shadow-md z-30 items"
    :style="style"
  >
    <button class="row-menu-item" v-if="props.hasView" @click="emit('view')">
      View
    </button>
    <slot></slot>
    <button
      class="row-menu-item"
      v-if="props.hasDelete"
      @click="emit('delete')"
    >
      Delete
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  top: {
    type: Number,
    required: false
  },
  hasDelete: {
    type: Boolean,
    default: true
  },
  hasView: {
    type: Boolean,
    default: true
  },
  left: {
    type: Number,
    default: 0
  },
  target: {
    type: HTMLElement,
    required: false
  }
})

const style = ref({
  top: `${props.top}px`,
  left: `${props.left ? props.left : 'auto'}px`
})

const right = 8

if (props.target) {
  style.value.top = `${props.target.offsetTop}px`
  style.value.left = `calc(${props.target.offsetLeft}px - ${right + 4}%)`
  style.value.right = `${right}%`
}

watch(
  () => props.target,
  () => {
    if (props.target) {
      style.value.top = `${props.target.offsetTop}px`
      style.value.left = `calc(${props.target.offsetLeft}px - ${right + 4}%)`
    }
  }
)

const emit = defineEmits(['delete', 'view'])
</script>
