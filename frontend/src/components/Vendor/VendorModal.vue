<template>
  <ModalWrapper :title="title" v-model="showModal" @submit="onSubmit">
    <div class="flex flex-col gap-4 my-7">
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Basic Info</p>
        <div class="flex gap-6">
          <CustomInput
            type="text"
            class="flex-1"
            name="company_name"
            placeholder="Company Name"
            v-model="model.company_name"
          />
          <CustomInput
            type="select"
            class="flex-1"
            name="annotation"
            v-model="model.annotation"
            placeholder="Select annotation"
            :options="[
              { text: 'Mr.', value: 'Mr.' },
              { text: 'Ms.', value: 'Ms.' },
              { text: 'Mrs.', value: 'Mrs.' },
            ]"
          />
        </div>
        <div class="flex gap-6">
          <CustomInput
            type="text"
            class="flex-1"
            name="first_name"
            placeholder="First Name"
            v-model="model.first_name"
          />
          <CustomInput
            type="text"
            class="flex-1"
            name="last_name"
            placeholder="Last Name"
            v-model="model.last_name"
          />
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Address Info</p>
        <AddressForm :has-label="true" v-model="model.address" />
      </div>
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Contact Info</p>
        <div class="flex gap-6">
          <CustomInput
            type="text"
            name="phone"
            class="flex-1"
            placeholder="Mobile Number"
            v-model="model.phone"
          />
          <CustomInput
            type="text"
            class="flex-1"
            name="telephone"
            placeholder="Telephone Number"
            v-model="model.telephone"
          />
        </div>
        <div class="flex gap-6">
          <CustomInput
            type="text"
            name="email"
            class="flex-1"
            placeholder="Email"
            v-model="model.email"
          />
          <CustomInput
            name="fax"
            type="text"
            class="flex-1"
            placeholder="Fax"
            v-model="model.fax"
          />
        </div>
      </div>
    </div>
  </ModalWrapper>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue';
import { Method, authenticatedApi } from '@/api';
import ModalWrapper from '@/components/shared/ModalWrapper.vue';
import AddressForm from '../shared/AddressForm.vue';
import { useVendorStore } from '@/stores/supplier';
import { onMounted, ref } from 'vue';

const showModal = defineModel();

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  selectedId: {
    type: Number,
    required: false,
  },
});

const supplierStore = useVendorStore();
const title = ref(
  props.isEdit ? 'Edit Vendor/Supplier' : 'New Vendor/Supplier',
);
const apiPath = ref(props.isEdit ? 'suppliers/update' : 'suppliers/register');
const model = ref({
  company_name: '',
  first_name: '',
  last_name: '',
  annotation: '',
  phone: '',
  email: '',
  telephone: '',
  fax: '',
  address: {
    address1: '',
    address2: '',
    city: '',
    province: '',
    postal: '',
  },
});

const onSubmit = async () => {
  const res = await authenticatedApi(apiPath.value, Method.POST, model.value);
  await supplierStore.fetchAllSuppliers();

  if (res.status == 200) {
    showModal.value = false;
  }
};

onMounted(() => {
  if (props.isEdit && props.selectedId) {
    model.value = supplierStore.suppliers.find(
      (sup) => sup.id == props.selectedId,
    );
  }
});
</script>
