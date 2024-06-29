<template>
  <ModalWrapper
    save-btn="Add"
    title="Add Product"
    v-model="showModal"
    @submit="showModal = false"
  >
    <div class="flex gap-3 my-7">
      <select name="" id="" class="input flex-1">
        <option value="">Select Product</option>
      </select>
      <input type="number" class="input" placeholder="Quantity" />
    </div>
  </ModalWrapper>
</template>

<script setup>
import { onMounted } from "vue";
import ModalWrapper from "../shared/ModalWrapper.vue";
import { useProductStore } from "@/stores/product";

const showModal = defineModel();
const productStore = useProductStore();

onMounted(async () => {
  await productStore.fetchAllProducts();
});
</script>
