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
  <div class="table-wrapper w-full relative">
    <div class="flex justify-between items-center">
      <input type="search" class="input w-full max-w-72" placeholder="Search" />
      <button
        class="bg-primary p-2 rounded"
        @click="
          showModal = true;
          isEdit = false;
        "
      >
        <img src="../assets//icons/plus.svg" alt="Plus" />
      </button>
    </div>
    <hr class="bg-gray-50 -mx-4" />
    <div class="flex flex-col gap-7 overflow-x-auto pb-5">
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
    </div>
    <Pagination />
  </div>
</template>
<script setup>
import EmployeeModal from "@/components/Employee/EmployeeModal.vue";
import { onMounted, ref } from "vue";
import EmployeeRow from "@/components/Employee/EmployeeRow.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import Pagination from "@/components/shared/Paginate.vue";
import { useEmployeeStore } from "@/stores/employee";

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
