<template>
  <div ref="tableRef">
    <CustomTable
      :has-tools="true"
      :has-add-btn="false"
      :data="filteredData"
      :row-prop-init="rowPropInit"
      v-model:searchText="searchText"
      :table-row-component="SalesByItemRow"
    >
      <template #table_header>
        <div class="grid grid-cols-15 gap-3 min-w-[1240px]">
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
      <template #tools>
        <div class="flex gap-6">
          <CustomInput
            type="date"
            label="From:"
            name="date-from"
            :has-label="true"
            v-model="dateFilter.from"
            class="[&>div]:gap-3 [&>div]:items-center [&>div]:flex-row w-fit"
          />
          <CustomInput
            type="date"
            label="To:"
            name="date-to"
            :has-label="true"
            v-model="dateFilter.to"
            class="[&>div]:gap-3 [&>div]:items-center [&>div]:flex-row w-fit"
          />
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
import CustomInput from '@/components/shared/CustomInput.vue'
import SalesByItemRow from '@/components/sales/SalesByItemRow.vue'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { onMounted, computed, ref, watch } from 'vue'
import { useTableScroll } from '@/use/useTableScroll'
import Event from '@/event'
import { EventEnum } from '@/data/event'

import Printer from '@/assets/icons/printer.png'
import { useRouter } from 'vue-router'
import { ReportConst } from '@/const/route.constants'
import { DateHelpers } from 'shared'

const tableRef = ref(null)
const router = useRouter()
const productStore = useProductStore()
const { salesByItem } = storeToRefs(productStore)

const dateFilter = ref({
  from: '',
  to: ''
})
const searchText = ref('')

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
  return Object.entries(salesByItem.value)
})

/** ================================================
 * METHODS
 ** ================================================*/
const setFilterDate = () => {
  const current = new Date()
  // Get the previous date and it's first date
  dateFilter.value.to = DateHelpers.formatDate(current, 'YYYY-MM-DD')

  const previous = new Date(current.getFullYear(), current.getMonth() - 1, 1)
  dateFilter.value.from = DateHelpers.formatDate(previous, 'YYYY-MM-DD')
}
setFilterDate()

const onPrint = () => {
  router.push({
    name: ReportConst.PRINT_SALES_BY_ITEM_DETAILED,
    query: {
      ...dateFilter.value
    }
  })
}

onMounted(async () => {
  await productStore.fetchSalesByItem(
    dateFilter.value.from,
    dateFilter.value.to
  )

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

/** ================================================
 * WATCHERS
 ** ================================================*/
watch(
  () => ({ from: dateFilter.value.from, to: dateFilter.value.to }),
  async (newVal, oldVal) => {
    if (newVal.from != oldVal.from || newVal.to != oldVal.to) {
      // call api to handle date filter changes
      await productStore.fetchSalesByItem(
        dateFilter.value.from,
        dateFilter.value.to
      )
    }
  },
  { deep: true }
)
</script>
