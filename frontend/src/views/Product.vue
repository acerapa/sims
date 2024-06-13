<template>
  <ProductModal :is-edit="false" v-model="showModal" v-if="showModal" />
  <div class="table-wrapper w-full">
    <div class="flex justify-between items-center">
      <input type="search" class="input w-full max-w-72" placeholder="Search" />
      <button
        class="bg-primary p-2 rounded"
        @click="
          showModal = true;
          isEdit = false;
        "
      >
        <img src="../assets//icons/plus.svg" alt="Plus" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ProductModal from "@/components/Product/ProductModal.vue";

const showModal = ref(true);
const isEdit = ref(false);
</script>
