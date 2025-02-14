<template>
  <div
    class="grid grid-cols-9 gap-3 gen-table-row"
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
    <div class="col-span-1">
      <BadgeComponent
        :text="StockTransferStatusMap[props.ibrr.status].text"
        :custom-class="StockTransferStatusMap[props.ibrr.status].class"
      />
    </div>
  </div>
</template>

<script setup>
import { DateHelpers } from 'shared/helpers'
import BadgeComponent from '../shared/BadgeComponent.vue'
import { computed } from 'vue'
import { StockTransferStatusMap } from 'shared'

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
