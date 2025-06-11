<template>
  <div class="cont flex flex-col gap-3">
    <!-- manually define the header here -->
    <div class="grid grid-cols-12 gap-3">
      <p class="col-span-5 table-header">Inventory</p>
      <p class="col-span-2 table-header">Supplier</p>
      <p class="col-span-1 table-header">Quantity</p>
      <p class="col-span-1 table-header">Sales</p>
      <p class="col-span-1 table-header">Available</p>
      <p class="col-span-1 table-header">OS</p>
      <p class="col-span-1 table-header">PO</p>
    </div>
    <hr>
    <div class="grid grid-cols-12 ga-3">
      
    </div>
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

const productStocks = ref([])

const productStore = useProductStore()

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)


/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted( async () => {
  productStocks.value = await productStore.fetchInventoryStock()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
