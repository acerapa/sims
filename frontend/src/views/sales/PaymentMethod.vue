<template>
  <div ref="tableRef">
    <CustomTable
      class="!w-auto"
      :data="filteredData"
      :has-check-box="false"
      title="Payment Method list"
      :row-prop-init="rowPropInit"
      :table-row-component="PaymentMethodRow"
      @add-new-record="onNewRecord"
      @view="onView"
    >
      <template #table_header>
        <div class="grid gap-3 grid-cols-8">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" v-if="false" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-7 table-header">Name</p>
        </div>
      </template>
    </CustomTable>
  </div>
  <PaymentMethodModal
    :selected-id="selectedId"
    v-model="showModal"
    v-if="showModal"
  />
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import { usePaymentMethodStore } from '@/stores/payment-method'
import PaymentMethodRow from '@/components/sales/payment-method/PaymentMethodRow.vue'
import PaymentMethodModal from '@/components/sales/payment-method/PaymentMethodModal.vue'
import { computed, onMounted, ref } from 'vue'
import Event from '@/event'
import { useTableScroll } from '@/use/useTableScroll'

const paymentMethodStore = usePaymentMethodStore()

const showModal = ref(false)
const selectedId = ref(null)
const tableRef = ref(null)

// composables
useTableScroll(tableRef, false)

/** ================================================
 * EVENTS
 ** ================================================*/
const rowPropInit = 'payment-method-row-init'
Event.on(rowPropInit, (data) => {
  return {
    paymentMethod: data
  }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return paymentMethodStore.paymentMethods
})

/** ================================================
 * METHODS
 ** ================================================*/
const onNewRecord = () => {
  selectedId.value = 0
  showModal.value = true
}

const onView = (id) => {
  selectedId.value = id
  showModal.value = true
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await paymentMethodStore.getPaymentMethods()
})
</script>
