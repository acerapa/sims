<template>
  <EmployeeModal v-model="showModal" />
  <div class="table-wrapper bg-white w-full flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <input type="search" class="input w-full max-w-72" placeholder="Search" />
      <button class="bg-primary p-2 rounded" @click="showModal = true">
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
          v-for="user in users"
          :user="user"
          :key="user.id"
          @open-menu="onSelectRow"
          :current-open-menu="selectedMenuRow"
          @click="sampleClick"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { authenticatedApi } from "@/api";
import EmployeeModal from "@/components/Employee/EmployeeModal.vue";
import { onMounted, ref } from "vue";
import EmployeeRow from "@/components/Employee/EmployeeRow.vue";

const showModal = ref(false);
const selectedMenuRow = ref(-1);
const users = ref([]);

onMounted(async () => {
  const res = await authenticatedApi("users/all");
  if (res.status == 200) {
    users.value = res.data.users;
  }
});

const onSelectRow = (data) => {
  selectedMenuRow.value = data;
};

const sampleClick = (event) => {
  console.log(event.target.classList);
  if (Array.from(event.target.classList).includes("menu-btn-trigger")) {
    console.log("Img element!");
  }
};
</script>
