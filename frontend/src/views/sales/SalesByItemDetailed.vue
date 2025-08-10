<template>
  <div ref="tableRef">
    <CustomTable
      :data="filteredData"
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
          <p class="col-span-1 table-header">Qty</p>
          <p class="col-span-1 table-header">Price</p>
          <p class="col-span-1 table-header">Amount</p>
        </div>
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

onMounted(async () => {
  await productStore.fetchSalesByItem()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
