<template>
  <div
    class="grid grid-cols-8 gap-3 gen-table-row"
    @click="emit('view', props.paymentMethod.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.paymentMethod.id }}</p>
    </div>
    <p class="col-span-7 text-sm">{{ props.paymentMethod.name }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  paymentMethod: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['view'])
</script>
