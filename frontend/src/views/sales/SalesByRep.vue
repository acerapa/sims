<template>
  <div ref="tableRef">
    <CustomTable
      :row-prop-init="rowPropInit"
      :data="filteredData"
      :has-add-btn="false"
      :table-row-component="SalesByRepRow"
    >
      <template #table_header>
        <div class="grid grid-cols-20 gap-3 min-w-[1240px]">
          <p class="col-span-3 table-header">Type</p>
          <p class="col-span-2 table-header">Date</p>
          <p class="col-span-1 table-header text-center">Inv #</p>
          <p class="col-span-4 table-header">Customer</p>
          <p class="col-span-5 table-header">Item Description</p>
          <p class="col-span-1 table-header text-center">Qty</p>
          <p class="col-span-2 table-header text-end">Price</p>
          <p class="col-span-2 table-header text-end">Amount</p>
        </div>
      </template>
      <template #buttons>
        <button class="btn flex gap-3 items-center" @click="onPrint">
          <img class="invert w-5" :src="Printer" />
          <p>Print</p>
        </button>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import SalesByRepRow from '@/components/sales/reports/SalesByRepRow.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { computed, onMounted, ref } from 'vue'

import Printer from '@/assets/icons/printer.png'
import { useInvoiceStore } from '@/stores/invoice'
import { storeToRefs } from 'pinia'
import { useTableScroll } from '@/use/useTableScroll'

const tableRef = ref()
const invoiceStore = useInvoiceStore()
const { salesByRep } = storeToRefs(invoiceStore)

// Composables
useTableScroll(tableRef, false)

/** ================================================
 * EVENTS
 ** ================================================*/
const rowPropInit = 'sales-by-representative-row-prop-init'
Event.on(rowPropInit, (data) => {
  return {
    sales: data
  }
})

Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => salesByRep.value.filter((d) => d))

/** ================================================
 * METHODS
 ** ================================================*/
const onPrint = () => {}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await invoiceStore.fetchInvoiceByRep()
  console.log(salesByRep.value)
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
