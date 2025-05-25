<template>
  <div ref="tableRef">
    <CustomTable
      @view="onView"
      :data="filteredData"
      :has-add-btn="false"
      :has-pagination="true"
      :row-prop-init="rowPropInit"
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
  </div>
  <DeliveryModal
    v-if="showModal"
    :selected-id="selectedId"
    v-model="showModal"
  />
</template>

<script setup>
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { useDeliveryStore } from '@/stores/delivery'
import { computed, onMounted, ref } from 'vue'

import DeliveryModal from '@/components/sales/DeliveryModal.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import DeliveryRow from '@/components/sales/DeliveryRow.vue'
import { storeToRefs } from 'pinia'
import { useTableScroll } from '@/use/useTableScroll'

const deliveryStore = useDeliveryStore()
const { deliveries } = storeToRefs(deliveryStore)

const selectedId = ref(0)
const showModal = ref(false)

const tableRef = ref(null)

// composables
useTableScroll(tableRef, false)

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
  return deliveries.value.filter((delivery) => delivery)
})

/** ================================================
 * METHODS
 ** ================================================*/
const onView = (id) => {
  selectedId.value = id
  showModal.value = true
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await deliveryStore.getDeliveries()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
