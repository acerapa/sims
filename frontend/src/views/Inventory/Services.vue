<template>
  <div ref="tableRef">
    <CustomTable
      :has-filter="true"
      :data="filteredData"
      :has-pagination="true"
      :has-check-box="false"
      v-model:search-text="searchText"
      :row-prop-init="serviceRowPropInit"
      :table-row-component="ServiceRow"
      @add-new-record="onNewRecord"
      @view="onView"
    >
      <template #table_header>
        <div class="grid grid-cols-10 gap-3 min-w-[907px]">
          <div class="col-span-1 flex gap-3 items-center">
            <input v-if="false" type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-2 table-header">Name</p>
          <p class="col-span-4 table-header">Description</p>
          <p class="col-span-1 table-header text-end pr-3">Price</p>
          <p class="col-span-2 table-header text-center">Added on</p>
        </div>
      </template>
    </CustomTable>
  </div>

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
import { useTableScroll } from '@/use/useTableScroll'

const serviceStore = useServiceStore()

const searchText = ref('')
const showServiceModal = ref(false)
const selectedId = ref(0)
const tableRef = ref(null)

// composables
useTableScroll(tableRef, false)

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
  return serviceStore.services.filter((service) => {
    const searchCondition =
      `${service.id} ${service.name} ${service.price} ${service.service_details.description} ${service.createdAt}`.toLowerCase()

    return searchText.value
      ? searchCondition.includes(searchText.value.toLowerCase())
      : true
  })
})

/** ================================================
 * METHODS
 ** ================================================*/
const onNewRecord = () => {
  selectedId.value = 0
  showServiceModal.value = true
}

const onView = (id) => {
  selectedId.value = id
  showServiceModal.value = true
}

onMounted(async () => {
  await serviceStore.getServices()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
