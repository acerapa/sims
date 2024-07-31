<template>
  <button :class="['badge', props.customClass]">{{ props.text }}</button>
</template>

<script setup>
const props = defineProps({
  customClass: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});
</script>
