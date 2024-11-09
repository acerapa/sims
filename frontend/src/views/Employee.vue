<template>
  <EmployeeModal
    v-model="showModal"
    :is-edit="isEdit"
    :selected-id="selectedId"
    v-if="showModal"
  />
  <DeleteConfirmModal
    v-model="showDeleteConfirmModal"
    v-if="showDeleteConfirmModal"
    :href="'users/delete'"
    :data="toDelete"
    @after-delete="afterDelete"
  />
  <CustomTable
    class="relative"
    title="Employee table"
    :has-add-btn="true"
    :data="filteredData"
    :has-pagination="true"
    v-model:is-edit="isEdit"
    v-model:show-modal="showModal"
    v-model:search-text="searchText"
    :row-prop-init="employeeRowEvent"
    :table-row-component="EmployeeRow"
    :table-header-component="EmployeeTableHeader"
    @open-menu="onSelectRow"
  >
    <RowMenu
      :top="top"
      v-if="showRowMenu"
      @view="viewRow"
      @delete="deleteRow"
    />
  </CustomTable>
</template>
<script setup>
import EmployeeModal from "@/components/Employee/EmployeeModal.vue";
import { computed, onMounted, ref } from "vue";
import EmployeeRow from "@/components/Employee/EmployeeRow.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import { useEmployeeStore } from "@/stores/employee";
import CustomTable from "@/components/shared/CustomTableV2.vue";
import EmployeeTableHeader from "@/components/Employee/EmployeeTableHeader.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import Event from "@/event";
import { EventEnum } from "@/data/event";
import { DateHelpers } from "shared/helpers/date";

const top = ref(0);
const showRowMenu = ref(false);
const showModal = ref(false);
const showDeleteConfirmModal = ref(false);
const toDelete = ref();
const isEdit = ref(false);
const selectedId = ref(-1);
const employeeStore = useEmployeeStore();
const searchText = ref();

/** ================================================
 * EVENTS
 ** ================================================*/

Event.emit(EventEnum.IS_PAGE_LOADING, true);

// custom event
Event.on(EventEnum.GLOBAL_CLICK, function () {
  showRowMenu.value = false;
});

// define employee row props
const employeeRowEvent = "employee-row-init-props";
Event.on(employeeRowEvent, function (data) {
  return { user: data };
});

/** ================================================
 * COMPUTED
 ** ================================================*/

const filteredData = computed(() => {
  return employeeStore.employees.filter((employee) => {
    const searchCondition =
      `${employee.id} ${employee.first_name} ${employee.last_name} ${employee.username} ${DateHelpers.formatDate(employee.date_started, "M/D/YYYY")} ${employee.position} ${employee.date_ended ? DateHelpers.formatDate(employee.date_ended, "M/D/YYYY") : ""}`.toLowerCase();
    return searchText.value
      ? searchCondition.includes(searchText.value.toLowerCase())
      : employee;
  });
});

/** ================================================
 * METHODS
 ** ================================================*/

const onSelectRow = (id) => {
  selectedId.value = id;
  top.value = event.target.offsetTop;
  showRowMenu.value = true;
};

const viewRow = () => {
  isEdit.value = true;
  showModal.value = true;
};

const deleteRow = () => {
  toDelete.value = { user_id: selectedId.value };
  showDeleteConfirmModal.value = true;
};

const afterDelete = async () => {
  await employeeStore.fetchAllEmployees();
  showDeleteConfirmModal.value = false;
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await employeeStore.fetchAllEmployees();
  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
