<template>
  <ModalWrapper title="New Employee" v-model="showModal" @submit="onSubmit">
    <div class="flex flex-col gap-6 mt-10">
      <div class="flex gap-3">
        <input
          type="text"
          class="input flex-1"
          v-model="model.username"
          placeholder="Username"
        />
        <select class="input w-[calc(50%-6px)]" v-model="model.status">
          <option value="" hidden>Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <input
          type="text"
          class="input flex-1 !w-auto"
          placeholder="First Name"
          v-model="model.first_name"
        />
        <input
          type="text"
          class="input flex-1 !w-auto"
          placeholder="Middle Name"
          v-model="model.middle_name"
        />
        <input
          type="text"
          class="input flex-1 !w-auto"
          placeholder="Last Name"
          v-model="model.last_name"
        />
      </div>
      <div class="flex gap-3">
        <select class="input flex-1" v-model="model.position">
          <option value="" hidden>Select Position</option>
          <option value="admin">Admin</option>
          <option value="inventory">Inventory Manager</option>
          <option value="cashier">Cashier</option>
        </select>
        <input
          type="date"
          class="input flex-1"
          placeholder="Date Started"
          v-model="model.date_started"
        />
      </div>
      <div class="flex gap-3"></div>
    </div>
  </ModalWrapper>
</template>
<script setup>
import { Method, authenticatedApi } from "@/api";
import ModalWrapper from "@/components/shared/ModalWrapper.vue";
import { useEmployeeStore } from "@/stores/employee";
import { ObjectHelpers } from "shared";
import { onMounted, ref } from "vue";

const props = defineProps({
  isEdit: {
    type: Boolean,
    required: false,
    default: false,
  },
  selectedId: {
    type: Number,
    required: false,
  },
});

const apiPath = props.isEdit
  ? `users/${props.selectedId}/update`
  : "users/register";
const employeeStore = useEmployeeStore();

const model = ref({
  username: "",
  status: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  position: "",
  date_started: "",
  password: "",
});

const showModal = defineModel();

onMounted(() => {
  if (props.isEdit) {
    const employee = employeeStore.employees.find(
      (emp) => emp.id == props.selectedId
    );
    if (employee) {
      model.value = ObjectHelpers.assignSameFields(model.value, employee);

      // update date
      model.value.date_started = model.value.date_started.split("T")[0];
    }
  } else {
    model.value = ObjectHelpers.objectReset(model.value);
  }
});

const onSubmit = async () => {
  if (!props.isEdit) {
    model.value.password = `${
      model.value.username
    }-${new Date().getFullYear()}`;
  }
  const res = await authenticatedApi(apiPath, Method.POST, model.value);
  // TODO: Show alert. Currently we have no alert component so go ahead and create it first
  showModal.value = false;
  // Refetch the updated data from database via store
  await employeeStore.fetchAllEmployees();
};
</script>
