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
      <div class="flex gap-3 w-full">
        <input
          type="text"
          class="input flex-1"
          placeholder="First Name"
          v-model="model.first_name"
        />
        <input
          type="text"
          class="input flex-1"
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
    </div>
  </ModalWrapper>
</template>
<script setup>
import { Method, authenticatedApi } from "@/api";
import ModalWrapper from "@/components/wrappers/ModalWrapper.vue";
import { ref } from "vue";

const props = defineProps({
  isEdit: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const apiPath = props.isEdit ? "" : "users/register";

const model = ref({
  username: "",
  status: "",
  first_name: "",
  last_name: "",
  position: "",
  date_started: "",
  password: "",
});

const showModal = defineModel();

const onSubmit = async () => {
  model.value.password = `${model.value.username}-${new Date().getFullYear()}`;
  const res = await authenticatedApi(apiPath, Method.POST, model.value);
  // TODO: Show alert. Currently we have no alert component so go ahead and create it first
  showModal.value = false;
};
</script>
