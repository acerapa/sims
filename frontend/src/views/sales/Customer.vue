<template>
  <CustomerModal
    v-if="showModal"
    v-model="showModal"
    :selected-id="selectedId"
  />
  <CustomTable
    :class="`w-[calc(100vw_-_${328}px)]`"
    :data="filteredData"
    title="Customer List"
    :has-pagination="true"
    :row-prop-init="rowPropInit"
    :table-row-component="CustomerRow"
    @add-new-record="
      () => {
        showModal = true
        selectedId = 0
      }
    "
    @view="onView"
  >
    <template #table_header>
      <div class="grid grid-cols-8 gap-3 min-w-[888px]">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="font-bold">#</p>
        </div>
        <p class="col-span-2 table-header">Name</p>
        <p class="col-span-4 table-header">Address</p>
        <p class="col-span-1 table-header">Phone</p>
      </div>
    </template>
  </CustomTable>
  <code
    >This is the list/records of the customers so far that buys the
    products</code
  >
</template>

<script setup>
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { computed, onMounted, ref } from 'vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import CustomerRow from '@/components/Customer/CustomerRow.vue'
import CustomerModal from '@/components/Customer/CustomerModal.vue'
import { useCustomerStore } from '@/stores/customer'

const showModal = ref(false)
const selectedId = ref(0)

const customerStore = useCustomerStore()

const filteredData = computed(() => {
  return customerStore.customers.filter((customer) => true)
})

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

const rowPropInit = 'customer-row-prop-int'
Event.on(rowPropInit, (customer) => {
  return { customer }
})

const onView = (id) => {
  selectedId.value = id
  showModal.value = true
}

onMounted(async () => {
  await customerStore.getCustomers()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
