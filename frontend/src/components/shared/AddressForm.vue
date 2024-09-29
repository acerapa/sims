<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-3">
      <CustomInput
        type="text"
        name="address1"
        class="w-full"
        placeholder="Address 1"
        v-model="model.address1"
        :disabled="props.disabled"
      />
      <CustomInput
        type="text"
        class="w-full"
        name="address2"
        placeholder="Address 2"
        v-model="model.address2"
        :disabled="props.disabled"
      />
    </div>
    <div class="flex gap-6 max-lg:flex-col max-lg:gap-3">
      <CustomInput
        type="text"
        name="city"
        class="flex-1"
        placeholder="City"
        v-model="model.city"
        :disabled="props.disabled"
      />
      <CustomInput
        type="text"
        name="postal"
        class="flex-1"
        placeholder="Zip Code"
        v-model="model.postal"
        :disabled="props.disabled"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import CustomInput from "./CustomInput.vue";

const props = defineProps({
  address: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const model = ref({
  address1: props.address.address1,
  address2: props.address.address2,
  city: props.address.city,
  postal: props.address.postal,
});

const formModel = defineModel();

watch(
  () => model.value,
  (val) => {
    formModel.value = val;
  },
  {
    deep: true,
  }
);
</script>
