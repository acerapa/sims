<template>
  <CustomTable :data="filteredData" :table-row-component="ReceivedPaymentRow">
    <template #table_header>
      <div class="grid grid-cols-9 gap-3">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="table-header">#</p>
        </div>
        <p class="col-span-1 table-header">Invoice Id</p>
        <p class="col-span-2 table-header">Customer</p>
        <p class="col-span-2 table-header">Careof</p>
        <p class="col-span-1 table-header">Date</p>
        <p class="col-span-1 table-header">Amount</p>
        <p class="col-span-1 table-header">Remainder</p>
      </div>
    </template>
  </CustomTable>
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import ReceivedPaymentRow from '@/components/sales/received-payment/ReceivedPaymentRow.vue'

import { computed, onMounted } from 'vue'
import { useReceivedPaymentsStore } from '@/stores/received-payments'
import Event from '@/event'

const receivedPaymentsStore = useReceivedPaymentsStore()

/** ================================================
 * EVENTS
 ** ================================================*/
const rowPropInit = 'received-payment-row-prop-init'
Event.on(rowPropInit, (data) => {
  return {
    receivedPayment: data
  }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return receivedPaymentsStore.receivedPayments.filter(
    (receivePayment) => receivePayment
  )
})

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await receivedPaymentsStore.getReceivedPayments()
})
</script>
