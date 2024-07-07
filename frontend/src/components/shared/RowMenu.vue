<template>
  <div
    class="bg-white rounded-lg absolute right-12 flex flex-col shadow-md z-30 items"
    :style="{
      top: `${props.top}px`,
    }"
  >
    <button class="row-menu-item" v-if="props.hasView" @click="emit('view')">
      View
    </button>
    <button
      class="row-menu-item"
      v-if="props.hasDelete"
      @click="emit('delete')"
    >
      Delete
    </button>
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  top: {
    type: Number,
    required: true,
  },
  hasDelete: {
    type: Boolean,
    default: true,
  },
  hasView: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["delete", "view"]);
</script>
