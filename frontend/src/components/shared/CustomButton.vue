<template>
  <button :class="props.btnClass">{{ props.text }}</button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  btnClass: {
    type: String,
    default: 'btn',
  },
});
</script>
