<template>
  <ModalWrapper
    :title="title"
    v-model="showModal"
    @submit="onSubmit"
  >
    <div class="flex flex-col gap-4 my-7">
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Basic Info</p>
        <div class="flex gap-6">
          <input
            type="text"
            class="input flex-1"
            placeholder="Company Name"
            v-model="model.company_name"
          />
          <select class="input flex-1" v-model="model.annotation">
            <option value="" hidden>Select annotation</option>
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
            <option value="Mrs.">Mrs.</option>
          </select>
        </div>
        <div class="flex gap-6">
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
      </div>
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Address Info</p>
        <div class="flex flex-col gap-3">
          <input
            type="text"
            class="input w-full"
            placeholder="Address 1"
            v-model="model.address.address1"
          />
          <input
            type="text"
            class="input w-full"
            placeholder="Address 2"
            v-model="model.address.address2"
          />
        </div>
        <div class="flex gap-6">
          <input
            type="text"
            class="input flex-1"
            placeholder="City"
            v-model="model.address.city"
          />
          <input
            type="text"
            class="input flex-1"
            placeholder="Zip Code"
            v-model="model.address.postal"
          />
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Contact Info</p>
        <div class="flex gap-6">
          <input
            type="text"
            class="input flex-1"
            placeholder="Mobile Number"
            v-model="model.phone"
          />
          <input
            type="text"
            class="input flex-1"
            placeholder="Telephone Number"
            v-model="model.telephone"
          />
        </div>
        <div class="flex gap-6">
          <input
            type="text"
            class="input flex-1"
            placeholder="Email"
            v-model="model.email"
          />
          <input
            type="text"
            class="input flex-1"
            placeholder="Fax"
            v-model="model.fax"
          />
        </div>
      </div>
    </div>
  </ModalWrapper>
</template>

<script setup>
import { Method, authenticatedApi } from "@/api";
import ModalWrapper from "@/components/wrappers/ModalWrapper.vue";
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
		required: true
	}
});

const supplierStore = useVendorStore();
const title = ref(props.isEdit ? 'Edit Vendor/Supplier' : 'New Vendor/Supplier');
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
		model.value = supplierStore.suppliers.find(sup => sup.id == props.selectedId);
	}
});
</script>
