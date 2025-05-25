<template>
  <div
    class="grid gap-3 grid-cols-9 min-w-[985px] gen-table-row"
    @click="emit('view', props.invoice.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.invoice.id }}</p>
    </div>
    <p class="col-span-2 text-sm">{{ customerName }}</p>
    <p class="col-span-2 text-sm">{{ employeeName }}</p>
    <p class="col-span-1 text-sm">
      {{
        new Date(props.invoice.issue_date).toLocaleString('default', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        })
      }}
    </p>
    <p class="col-span-1 text-sm">
      {{
        new Date(props.invoice.due_date).toLocaleString('default', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        })
      }}
    </p>
    <div class="col-span-1 text-sm">
      <BadgeComponent
        :text="InvoiceStatusMap[props.invoice.status].text"
        :custom-class="InvoiceStatusMap[props.invoice.status].class"
      />
    </div>
    <p class="col-span-1 text-sm">₱ {{ props.invoice.total }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { InvoiceStatusMap } from 'shared'

import BadgeComponent from '@/components/shared/BadgeComponent.vue'

const emit = defineEmits(['view'])

const props = defineProps({
  invoice: {
    type: Object,
    default: () => ({})
  }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const customerName = computed(() => {
  let { customer } = props.invoice
  if (!customer) customer = props.invoice.sales_order.customer

  return `${customer.first_name} ${customer.last_name}`
})

const employeeName = computed(() => {
  let { sales_person } = props.invoice
  if (!sales_person) sales_person = props.invoice.sales_order.sales_person

  return `${sales_person.first_name} ${sales_person.last_name}`
})
</script>
