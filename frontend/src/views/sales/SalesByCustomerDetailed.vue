<template>
  <div ref="tableRef">
    <CustomTable :data="filteredData" :has-add-btn="false">
      <template #table_header>
        <div class="grid grid-cols-13 gap-3">
          <p class="col-span-2 table-header">Customer</p>
          <p class="col-span-1 table-header">Invoice #</p>
          <p class="col-span-2 table-header">Inv. Date</p>
          <p class="col-span-4 table-header">Item Description</p>
          <p class="col-span-1 table-header">Quantity</p>
          <p class="col-span-1 table-header">Sale price</p>
          <p class="col-span-1 table-header">Total</p>
          <p class="col-span-1 table-header">Balace</p>
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

// import icon
import Printer from '@/assets/icons/printer.png'
import { computed, onMounted, ref } from 'vue'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { useTableScroll } from '@/use/useTableScroll'

const tableRef = ref(null)
const dateFilter = ref({
  from: '',
  to: ''
})

// composables
useTableScroll(tableRef, false)
/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return []
})

/** ================================================
 * METHODS
 ** ================================================*/
const onPrint = () => {
  // router.push({
  // 	name: ReportConst.PRINT_PURCHASE_BY_VENDOR_DETAILED,
  // 	query: {
  // 		search_text: searchText.value,
  // 		...dateFilter.value
  // 	}
  // })
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  // call api

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
