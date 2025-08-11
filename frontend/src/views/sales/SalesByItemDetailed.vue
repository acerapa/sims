<template>
  <div ref="tableRef">
    <CustomTable
      :has-add-btn="false"
      :data="Object.entries(salesByItem)"
      :row-prop-init="rowPropInit"
      :table-row-component="SalesByItemRow"
    >
      <template #table_header>
        <div class="grid grid-cols-15 gap-3">
          <p class="col-span-3 table-header">Type</p>
          <p class="col-span-2 table-header">Date</p>
          <p class="col-span-1 table-header"># Item</p>
          <p class="col-span-3 table-header">Memo</p>
          <p class="col-span-3 table-header">Name</p>
          <p class="col-span-1 table-header text-center">Qty</p>
          <p class="col-span-1 table-header text-end">Price</p>
          <p class="col-span-1 table-header text-end">Amount</p>
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
import SalesByItemRow from '@/components/sales/SalesByItemRow.vue'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { onMounted, computed, ref } from 'vue'
import { useTableScroll } from '@/use/useTableScroll'
import Event from '@/event'
import { EventEnum } from '@/data/event'

import Printer from '@/assets/icons/printer.png'

const tableRef = ref(null)
const productStore = useProductStore()
const { salesByItem } = storeToRefs(productStore)

// composables
useTableScroll(tableRef, false)
/** ================================================
 * EVENTS
 ** ================================================*/
const rowPropInit = 'sales-by-item-row-prop-init'
Event.on(rowPropInit, (data) => {
  return {
    sales: data
  }
})

Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return [salesByItem.value].filter((item) => item)
})

/** ================================================
 * METHODS
 ** ================================================*/
const onPrint = () => {}

onMounted(async () => {
  await productStore.fetchSalesByItem()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
