<template>
  <div
    class="grid grid-cols-11 gap-3 min-w-[935px] gen-table-row"
    @click="emit('view', props.order.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.order.id }}</p>
    </div>
    <p class="col-span-2 text-sm">{{ props.order.ref_no }}</p>
    <p class="col-span-2 text-sm">{{ props.order.supplier.company_name }}</p>
    <p class="col-span-1 text-sm">{{ props.order.amount }}</p>
    <p class="col-span-2 text-sm">
      {{ DateHelpers.formatDate(props.order.date, 'M/D/YYYY') }}
    </p>
    <p class="col-span-2 text-sm">
      {{ DateHelpers.formatDate(props.order.bill_due, 'M/D/YYYY') }}
    </p>
    <div class="col-span-1">
      <BadgeComponent
        :custom-class="selectedStatus.class"
        :text="selectedStatus.text"
      />
    </div>
  </div>
</template>

<script setup>
import { DateHelpers } from 'shared'
import { PurchaseStatusMap } from 'shared'
import BadgeComponent from '@/components/shared/BadgeComponent.vue'

const emit = defineEmits(['view'])

const props = defineProps({
  order: {
    type: Object,
    default: () => ({})
  }
})

const selectedStatus = PurchaseStatusMap[props.order.status]
</script>
