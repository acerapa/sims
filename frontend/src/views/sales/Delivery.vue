<template>
  <CustomTable
    :row-prop-init="rowPropInit"
    :data="filteredData"
    :table-row-component="DeliveryRow"
  >
    <template #table_header>
      <div class="grid grid-cols-7">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="table-header">#</p>
        </div>

        <p class="col-span-1 table-header">Order #</p>
        <p class="col-span-2 table-header">Date</p>
        <p class="col-span-2 table-header">Courier</p>
        <p class="col-span-1 table-header">Status</p>
      </div>
    </template>
  </CustomTable>
</template>

<script setup>
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { useDeliveryStore } from '@/stores/delivery'
import { computed, onMounted } from 'vue'

import CustomTable from '@/components/shared/CustomTable.vue'
import DeliveryRow from '@/components/sales/DeliveryRow.vue'

const deliveryStore = useDeliveryStore()

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

const rowPropInit = 'delivery-row-prop-init'
Event.on(rowPropInit, (data) => {
  return {
    delivery: data
  }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return deliveryStore.deliveries
})

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await deliveryStore.fetchDeliveries()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
