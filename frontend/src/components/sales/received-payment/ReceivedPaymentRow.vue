<template>
  <div
    class="grid grid-cols-9 gap-3 gen-table-row min-w-[1030px]"
    @click="emit('view', props.receivedPayment.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.receivedPayment.id }}</p>
    </div>
    <RouterLink
      @click.stop
      :to="{
        name: SalesConst.INVOICE_FORM,
        query: {
          id: props.receivedPayment.invoice_id
        }
      }"
      class="col-span-1 text-sm hover:text-blue-500"
      >#{{ props.receivedPayment.invoice_id }}</RouterLink
    >
    <p class="col-span-2 text-sm">{{ customerName }}</p>
    <p class="col-span-2 text-sm">{{ employeeName }}</p>
    <p class="col-span-1 text-sm">
      {{
        new Date(props.receivedPayment.payment_date).toLocaleString('default', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        })
      }}
    </p>
    <p class="col-span-1 text-sm">{{ props.receivedPayment.amount }}</p>
    <p class="col-span-1 text-sm">
      {{ props.receivedPayment.remaining_balance }}
    </p>
  </div>
</template>

<script setup>
import { SalesConst } from '@/const/route.constants'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  receivedPayment: {
    type: Object,
    required: false
  }
})

const emit = defineEmits(['view'])

/** ================================================
 * COMPUTED
 ** ================================================*/
const customerName = computed(() => {
  const customer =
    props.receivedPayment.invoice.customer ||
    props.receivedPayment.invoice.sales_order.customer

  return `${customer.first_name} ${customer.last_name}`
})

const employeeName = computed(() => {
  const employee = props.receivedPayment.cashier

  return `${employee.first_name} ${employee.last_name}`
})
</script>
