<template>
  <ModalWrapper title="New Employee" v-model="showModal" @submit="onSubmit">
    <div class="flex flex-col gap-6 mt-10">
      <div class="flex gap-3">
        <CustomInput
          type="text"
          name="username"
          class="flex-1"
          v-model="model.username"
          placeholder="Username"
        />
        <CustomInput
          class="flex-1"
          name="status"
          type="select"
          :options="[
            { text: 'Active', value: 1 },
            { text: 'Inactive', value: 0 },
          ]"
          placeholder="Status"
          v-model="model.status"
        />
      </div>
      <div class="grid grid-cols-3 gap-3">
        <CustomInput
          type="text"
          class="flex-1"
          name="first_name"
          placeholder="First Name"
          v-model="model.first_name"
        />
        <CustomInput
          type="text"
          name="middle_name"
          class="flex-1"
          placeholder="Middle Name"
          v-model="model.middle_name"
        />
        <CustomInput
          name="last_name"
          type="text"
          class="flex-1"
          placeholder="Last Name"
          v-model="model.last_name"
        />
      </div>
      <div class="flex gap-3">
        <CustomInput
          type="select"
          class="flex-1"
          name="position"
          placeholder="Select Position"
          v-model="model.position"
          :options="positionOptions"
        />
        <CustomInput
          type="date"
          class="flex-1"
          name="date_started"
          placeholder="Date Started"
          v-model="model.date_started"
        />
      </div>
      <div class="flex gap-3"></div>
    </div>
  </ModalWrapper>
</template>
<script setup>
import { Method, authenticatedApi } from '@/api';
import CustomInput from '@/components/shared/CustomInput.vue';
import ModalWrapper from '@/components/shared/ModalWrapper.vue';
import { useEmployeeStore } from '@/stores/employee';
import { ObjectHelpers } from 'shared';
import { computed, onMounted, ref } from 'vue';

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
  : 'users/register';
const employeeStore = useEmployeeStore();

const model = ref({
  username: '',
  status: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  position: '',
  date_started: '',
  password: '',
});

const showModal = defineModel();

/** ================================================
 * COMPUTED
 ** ================================================*/
const positionOptions = computed(() => {
  return [
    { text: 'Admin', value: 'admin' },
    { text: 'Inventory Manager', value: 'inventory' },
    { text: 'Cashier', value: 'cashier' },
  ];
});

/** ================================================
 * METHODS
 ** ================================================*/
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

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(() => {
  if (props.isEdit) {
    const employee = employeeStore.employees.find(
      (emp) => emp.id == props.selectedId,
    );
    if (employee) {
      model.value = ObjectHelpers.assignSameFields(model.value, employee);

      // update date
      model.value.date_started = model.value.date_started.split('T')[0];
    }
  } else {
    model.value = ObjectHelpers.objectReset(model.value);
  }
});
</script>
