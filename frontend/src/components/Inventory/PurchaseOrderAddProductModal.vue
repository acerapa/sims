<template>
  <ModalWrapper
    title="Add Product"
    v-model="showModal"
    @submit="showModal = false"
  >
    <div class="flex flex-col gap-3 my-7">
      <select name="" id="" class="input">
        <option value="">Select Product</option>
      </select>
    </div>
  </ModalWrapper>
</template>

<script setup>
import ModalWrapper from "../shared/ModalWrapper.vue";

const showModal = defineModel();
</script>
