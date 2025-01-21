<template>
  <div class="grid grid-col-3 gap-3"></div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  }
})
</script>
