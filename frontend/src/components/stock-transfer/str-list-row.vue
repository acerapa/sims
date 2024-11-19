<template>
  <div
    class="grid grid-cols-7 gap-3 gen-table-row"
    @click="emit('view', props.str.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.str.id }}</p>
    </div>
    <p class="col-span-2 text-sm truncate">{{ props.str.receiver.name }}</p>
    <p class="col-span-1 text-sm truncate">{{ managerName }}</p>
    <p class="col-span-1 text-sm truncate">{{ processByName }}</p>
    <p class="col-span-2 text-sm truncate">
      {{ DateHelpers.formatDate(props.str.when, 'MM/DD/YYYY HH:II a') }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { DateHelpers } from 'shared/helpers'

const emit = defineEmits(['view'])
const props = defineProps({
  str: {
    type: Object,
    default: () => ({})
  }
})

const managerName = computed(() => {
  const { receiver } = props.str
  return `${receiver.manager.first_name} ${receiver.manager.last_name}`
})

const processByName = computed(() => {
  const { process_by } = props.str
  return `${process_by.first_name} ${process_by.last_name}`
})
</script>
