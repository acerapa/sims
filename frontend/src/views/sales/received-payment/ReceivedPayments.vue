<template>
  <CustomTable
    :data="filteredData"
    :row-prop-init="rowPropInit"
    :btn-custom-text="'Receive Payment'"
    :table-row-component="ReceivedPaymentRow"
    @add-new-record="onAddNewRecord"
  >
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
import { useRouter } from 'vue-router'
import { SalesConst } from '@/const/route.constants'
import { EventEnum } from '@/data/event'

const router = useRouter()
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

Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return receivedPaymentsStore.receivedPayments.filter(
    (receivePayment) => receivePayment
  )
})

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNewRecord = () => {
  router.push({
    name: SalesConst.RECEIVED_PAYMENT_FORM
  })
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await receivedPaymentsStore.getReceivedPayments()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
