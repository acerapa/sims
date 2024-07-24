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
  v-if="employeeStore.employees.length"
  class="relative"
  :has-add-btn="true"
  :has-pagination="true"
  v-model:is-edit="isEdit"
  v-model:show-modal="showModal"
  :data="employeeStore.employees"
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
import { onMounted, ref } from "vue";
import EmployeeRow from "@/components/Employee/EmployeeRow.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import { useEmployeeStore } from "@/stores/employee";
import CustomTable from "@/components/shared/CustomTable.vue";
import EmployeeTableHeader from "@/components/Employee/EmployeeTableHeader.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import Event from "@/event";

const top = ref(0);
const showRowMenu = ref(false);
const showModal = ref(false);
const showDeleteConfirmModal = ref(false);
const toDelete = ref();
const isEdit = ref(false);
const selectedId = ref(-1);
const employeeStore = useEmployeeStore();

// custom event
Event.on("global-click", function () {
  showRowMenu.value = false;
});

// define employee row props
const employeeRowEvent = "employee-row-init-props";
Event.on(employeeRowEvent, function (data) {
  return { user: data };
});

onMounted(async () => {
  await employeeStore.fetchAllEmployees();
});

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
</script>
