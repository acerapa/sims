<template>
  <div
    class="grid grid-cols-5 gap-3 items-center gen-table-row"
    @click="emit('view', props.customer.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.customer.id }}</p>
    </div>
    <p class="text-sm col-span-4">
      {{ `${props.customer.first_name} ${props.customer.last_name}` }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  customer: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['view'])
</script>
