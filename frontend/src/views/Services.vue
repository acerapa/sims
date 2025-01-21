<template>
  <CustomTable
    :has-filter="true"
    :data="filteredData"
    :has-pagination="true"
    :row-prop-init="serviceRowPropInit"
    :table-row-component="ServiceRow"
    @add-new-record="onNewRecord"
  >
    <template #table_header>
      <div class="grid grid-cols-9 gap-3">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="table-header">#</p>
        </div>
        <p class="col-span-2 table-header">Name</p>
        <p class="col-span-4 table-header">Description</p>
        <p class="col-span-1 table-header">Price</p>
        <p class="col-span-1 table-header">Added on</p>
      </div>
    </template>
  </CustomTable>

  <ServiceModal
    :selected-id="selectedId"
    v-if="showServiceModal"
    v-model="showServiceModal"
  />
</template>

<script setup>
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { computed, onMounted, ref } from 'vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import ServiceRow from '@/components/service/ServiceRow.vue'
import ServiceModal from '@/components/service/ServiceModal.vue'
import { useServiceStore } from '@/stores/services'

const serviceStore = useServiceStore()

const showServiceModal = ref(false)
const selectedId = ref(0)

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

const serviceRowPropInit = 'service-row-prop-init'
Event.on(serviceRowPropInit, (data) => {
  return { service: data }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return serviceStore.services
})

/** ================================================
 * METHODS
 ** ================================================*/
const onNewRecord = () => {
  showServiceModal.value = true
}

onMounted(async () => {
  await serviceStore.getServices()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
