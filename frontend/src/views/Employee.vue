<template>
  <EmployeeModal
    v-model="showModal"
    :selected-id="selectedId"
    v-if="showModal"
  />
  <CustomTable
    class="relative"
    title="Employee table"
    :has-add-btn="true"
    :data="filteredData"
    :has-pagination="true"
    @add-new-record="onNewRecord"
    v-model:search-text="searchText"
    :row-prop-init="employeeRowEvent"
    :table-row-component="EmployeeRow"
    @view="onView"
  >
    <template #table_header>
      <div class="grid grid-cols-12 gap-3 items-center min-w-[792px]">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="table-header">#</p>
        </div>
        <p class="col-span-2 table-header">Name</p>
        <p class="col-span-2 table-header">Branch</p>
        <p class="col-span-2 table-header">Position</p>
        <p class="col-span-2 table-header">Date Started</p>
        <p class="col-span-2 table-header">Date Ended</p>
        <p class="col-span-1 table-header">Status</p>
      </div>
    </template>
  </CustomTable>
</template>
<script setup>
import EmployeeModal from '@/components/Employee/EmployeeModal.vue'
import EmployeeRow from '@/components/Employee/EmployeeRow.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { useEmployeeStore } from '@/stores/employee'
import { DateHelpers } from 'shared'
import { computed, onMounted, ref } from 'vue'

const target = ref(null)
const showModal = ref(false)
const selectedId = ref(-1)
const employeeStore = useEmployeeStore()
const searchText = ref()

/** ================================================
 * EVENTS
 ** ================================================*/

Event.emit(EventEnum.IS_PAGE_LOADING, true)

// define employee row props
const employeeRowEvent = 'employee-row-init-props'
Event.on(employeeRowEvent, function (data) {
  return { user: data }
})

/** ================================================
 * COMPUTED
 ** ================================================*/

const filteredData = computed(() => {
  return employeeStore.employees.filter((employee) => {
    const searchCondition =
      `${employee.id} ${employee.first_name} ${employee.last_name} ${employee.username} ${DateHelpers.formatDate(employee.date_started, 'M/D/YYYY')} ${employee.position} ${employee.date_ended ? DateHelpers.formatDate(employee.date_ended, 'M/D/YYYY') : ''}`.toLowerCase()
    return searchText.value
      ? searchCondition.includes(searchText.value.toLowerCase())
      : employee
  })
})

/** ================================================
 * METHODS
 ** ================================================*/

const onView = (id) => {
  selectedId.value = id
  showModal.value = true
}

const onNewRecord = () => {
  selectedId.value = 0
  showModal.value = true
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await employeeStore.fetchAllEmployees()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
