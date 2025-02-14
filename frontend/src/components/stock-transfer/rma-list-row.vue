<template>
  <div
    class="grid grid-cols-10 gap-3 gen-table-row items-center"
    @click="emit('view', props.rma.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.rma.id }}</p>
    </div>
    <p class="col-span-3 text-sm">
      {{ props.rma.supplier.company_name }}
    </p>
    <p class="col-span-3 text-sm">
      {{ preparedByName }}
    </p>
    <p class="col-span-2 text-sm">
      {{ DateHelpers.formatDate(props.rma.when, 'MM/DD/YYYY HH:II a') }}
    </p>
    <div class="col-span-1">
      <BadgeComponent
        :text="StockTransferStatusMap[props.rma.status].text"
        :custom-class="StockTransferStatusMap[props.rma.status].class"
        x
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
  rma: {
    type: Object,
    default: () => ({})
  }
})

const preparedByName = computed(() => {
  return `${props.rma.process_by.first_name} ${props.rma.process_by.last_name}`
})
</script>
