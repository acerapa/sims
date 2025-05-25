<template>
  <div>
    <VendorModal
      v-if="showModal"
      v-model="showModal"
      :selected-id="selectedId"
    />
    <div ref="tableRef">
      <CustomTable
        :has-add-btn="true"
        :data="filteredData"
        :has-pagination="true"
        :row-prop-init="vendorRowEvent"
        v-model:search-text="searchText"
        :table-row-component="VendorRow"
        @view="onView"
        @add-new-record="
          () => {
            showModal = true
            selectedId = 0
          }
        "
      >
        <template #table_header>
          <div class="grid grid-cols-6 gap-3 items-center min-w-[564px]">
            <div class="col-span-1 flex gap-3 items-center">
              <input type="checkbox" class="input" />
              <p class="table-header">#</p>
            </div>
            <p class="col-span-3 table-header">Company Name</p>
            <p class="col-span-2 table-header">Rep. Name</p>
          </div>
        </template>
      </CustomTable>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import VendorModal from '@/components/Vendor/VendorModal.vue'
import VendorRow from '@/components/Vendor/VendorRow.vue'
import { useVendorStore } from '@/stores/supplier'
import CustomTable from '@/components/shared/CustomTable.vue'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { useTableScroll } from '@/use/useTableScroll'

const searchText = ref()
const selectedId = ref(-1)
const tableRef = ref(null)
const showModal = ref(false)
const vendorStore = useVendorStore()

useTableScroll(tableRef, false)

/** ================================================
 * EVENTS
 ** ================================================*/

// is page is loading
Event.emit(EventEnum.IS_PAGE_LOADING, true)

// define vendor row init props
const vendorRowEvent = 'vendor-row-props-init'
Event.on(vendorRowEvent, function (data) {
  return {
    supplier: data
  }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return vendorStore.suppliers.filter((supplier) => {
    const searchCondition =
      `${supplier.id} ${supplier.company_name} ${supplier.first_name} ${supplier.last_name} ${supplier.annotation ? supplier.annotation : ''}`.toLowerCase()
    return searchText.value
      ? searchCondition.includes(searchText.value.toLowerCase())
      : supplier
  })
})

/** ================================================
 * METHODS
 ** ================================================*/
const onView = (id) => {
  selectedId.value = id
  showModal.value = true
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await vendorStore.getSuppliers()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
