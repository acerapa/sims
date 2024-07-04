<template>
  <EmployeeModal
    v-model="showModal"
    :is-edit="isEdit"
    :selected-id="idToEdit"
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
    v-model:show-modal="showModal"
    v-model:is-edit="isEdit"
    :has-add-btn="true"
    :has-pagination="true"
  >
    <template v-slot:table_header>
      <div class="grid grid-cols-13 gap-3 items-center min-w-[792px]">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="table-header">#</p>
        </div>
        <p class="col-span-2 table-header">First Name</p>
        <p class="col-span-2 table-header">Last Name</p>
        <p class="col-span-2 table-header">Position</p>
        <p class="col-span-2 table-header">Date Started</p>
        <p class="col-span-2 table-header">Date Ended</p>
        <p class="col-span-1 table-header">Status</p>
        <p class="col-span-1 table-header">Action</p>
      </div>
    </template>
    <template v-slot:table_body>
      <div class="flex flex-col gap-4">
        <EmployeeRow
          v-for="user in employeeStore.employees"
          :user="user"
          :key="user.id"
          @open-menu="onSelectRow"
          :current-open-menu="selectedMenuRow"
          @view="viewRow"
          @delete="deleteRow"
        />
      </div>
    </template>
  </CustomTable>
</template>
<script setup>
import EmployeeModal from "@/components/Employee/EmployeeModal.vue";
import { onMounted, ref } from "vue";
import EmployeeRow from "@/components/Employee/EmployeeRow.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import { useEmployeeStore } from "@/stores/employee";
import CustomTable from "@/components/shared/CustomTable.vue";

const showModal = ref(false);
const showDeleteConfirmModal = ref(false);
const toDelete = ref();
const idToEdit = ref();
const isEdit = ref(false);
const selectedMenuRow = ref(-1);
const employeeStore = useEmployeeStore();

onMounted(async () => {
  await employeeStore.fetchAllEmployees();
});

const onSelectRow = (data) => {
  selectedMenuRow.value = data;
};

const viewRow = (user_id) => {
  isEdit.value = true;
  showModal.value = true;
  idToEdit.value = user_id;
};

const deleteRow = (user_id) => {
  toDelete.value = { user_id };
  showDeleteConfirmModal.value = true;
};

const afterDelete = async () => {
  await employeeStore.fetchAllEmployees();
  showDeleteConfirmModal.value = false;
};
</script>
