<template>
  <div ref="tableRef">
    <CustomTable
      :has-tools="false"
      :has-add-btn="false"
      :data="productStocks"
      :row-prop-init="rowPropInit"
      :table-header-component="StockStatusHeader"
      :table-row-component="StockStatusRow"
    />
  </div>
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import StockStatusRow from '@/components/Inventory/StockStatus/StockStatusRow.vue'
import StockStatusHeader from '@/components/Inventory/StockStatus/StockStatusHeader.vue'
import Event from '@/event'

import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { EventEnum } from '@/data/event/index'
import { useProductStore } from '@/stores/product'
import { useSettingsStore } from '@/stores/settings'

import { useTableScroll } from '@/use/useTableScroll'

const tableRef = ref(null)
const productStocks = ref([])

const productStore = useProductStore()
const settingStore = useSettingsStore()

const { productCategories } = storeToRefs(settingStore)

// composables
useTableScroll(tableRef, false)

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

const rowPropInit = 'inventory-stock-status-page'
Event.on(rowPropInit, (data) => {
  return {
    category: data
  }
})

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  productStocks.value = await productStore.fetchInventoryStock()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
