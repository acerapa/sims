<template>
  <div class="cont flex gap-3">
    <div class="flex-1">
      <p class="text-base font-semibold">Transfer Information</p>
      <div class="flex gap-6">
        <CustomInput type="text" name="text" />
      </div>
    </div>
    <div class="flex-1 flex flex-col gap-3">
      <p class="text-base font-semibold">Address Info</p>
      <AddressForm v-model="model.address" />
    </div>
  </div>
</template>

<script setup>
import CustomInput from "@/components/shared/CustomInput.vue";
import AddressForm from "@/components/shared/AddressForm.vue";
import { ref } from "vue";

const defaultValue = {
  address: {
    address1: "",
    address2: "",
    city: "",
    postal: "",
  },
};

const model = ref(defaultValue);
</script>
