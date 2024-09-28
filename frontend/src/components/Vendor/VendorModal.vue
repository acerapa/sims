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
        <div class="flex flex-col gap-3">
          <CustomInput
            type="text"
            name="addres1"
            class="w-full"
            placeholder="Address 1"
            v-model="model.address.address1"
          />
          <CustomInput
            type="text"
            name="addess2"
            class="w-full"
            placeholder="Address 2"
            v-model="model.address.address2"
          />
        </div>
        <div class="flex gap-6">
          <CustomInput
            type="text"
            name="city"
            class="flex-1"
            placeholder="City"
            v-model="model.address.city"
          />
          <CustomInput
            type="text"
            name="postal"
            class="flex-1"
            placeholder="Zip Code"
            v-model="model.address.postal"
          />
        </div>
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
import CustomInput from "../shared/CustomInput.vue";
import { Method, authenticatedApi } from "@/api";
import ModalWrapper from "@/components/shared/ModalWrapper.vue";
import { useVendorStore } from "@/stores/supplier";
import { onMounted, ref } from "vue";

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
  props.isEdit ? "Edit Vendor/Supplier" : "New Vendor/Supplier"
);
const apiPath = ref(props.isEdit ? "suppliers/update" : "suppliers/register");
const model = ref({
  company_name: "",
  first_name: "",
  last_name: "",
  annotation: "",
  phone: "",
  email: "",
  telephone: "",
  fax: "",
  address: {
    address1: "",
    address2: "",
    city: "",
    postal: "",
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
      (sup) => sup.id == props.selectedId
    );
  }
});
</script>
