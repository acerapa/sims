<template>
  <div
    class="grid grid-cols-8 gap-3 gen-table-row"
    @click="emit('view', props.ibrr.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.ibrr.id }}</p>
    </div>
    <p class="col-span-1 text-sm truncate">{{ props.ibrr.str_id }}</p>
    <p class="col-span-2 text-sm truncate">{{ props.ibrr.sender.name }}</p>
    <p class="col-span-1 text-sm truncate">{{ managerName }}</p>
    <p class="col-span-1 text-sm truncate">{{ processByName }}</p>
    <p class="col-span-2 text-sm truncate">
      {{ DateHelpers.formatDate(props.ibrr.when, 'MM/DD/YYYY HH:II a') }}
    </p>
  </div>
</template>

<script setup>
import { DateHelpers } from 'shared/helpers'
import { computed } from 'vue'

const emit = defineEmits(['view'])

const props = defineProps({
  ibrr: {
    type: Object,
    default: () => ({})
  }
})

const managerName = computed(() => {
  const { sender } = props.ibrr
  return `${sender.manager.first_name} ${sender.manager.last_name}`
})

const processByName = computed(() => {
  const { process_by } = props.ibrr
  return `${process_by.first_name} ${process_by.last_name}`
})
</script>
