<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-3">
      <input
        type="text"
        class="input w-full"
        placeholder="Address 1"
        v-model="model.address1"
      />
      <input
        type="text"
        class="input w-full"
        placeholder="Address 2"
        v-model="model.address2"
      />
    </div>
    <div class="flex gap-6 max-lg:flex-col max-lg:gap-3">
      <input
        type="text"
        class="input flex-1"
        placeholder="City"
        v-model="model.city"
      />
      <input
        type="text"
        class="input flex-1"
        placeholder="Zip Code"
        v-model="model.postal"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";

const model = ref({
  address1: "",
  address2: "",
  city: "",
  postal: "",
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
