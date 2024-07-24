<template>
  <ReceiveOrderModal v-model="showModal" v-if="showModal" />
  <div>
    <button class="btn mb-4" @click="showModal = true">Receive an Order</button>
    <CustomTable title="Recieve Orders"></CustomTable>
  </div>
</template>

<script setup>
import CustomTable from "@/components/shared/CustomTable.vue";
import ReceiveOrderModal from "@/components/Inventory/ReceiveOrderModal.vue";
import { ref } from "vue";

const showModal = ref(false);
</script>
