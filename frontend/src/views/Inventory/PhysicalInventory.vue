<template>
  <PhysicalInventoryCreateModal
    v-model="showCreationModal"
    v-if="showCreationModal"
  />
  <div class="flex flex-col gap-6">
    <button class="btn w-fit" @click="showCreationModal = true">
      New Physical Inventory
    </button>
    <CustomTable
      :has-add-btn="false"
      :data="filteredData"
      :row-prop-init="eventRowInit"
      :table-row-component="PhysicalInventoryRow"
      :table-header-component="PhysicalInventoryTableHeader"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import { usePhysicalInventoryStore } from "@/stores/physical-inventory";
import PhysicalInventoryRow from "@/components/Inventory/PhysicalInventoryRow.vue";
import PhysicalInventoryCreateModal from "@/components/Inventory/PhysicalInventoryCreateModal.vue";
import PhysicalInventoryTableHeader from "@/components/Inventory/PhysicalInventoryTableHeader.vue";
import Event from "@/event";

const showCreationModal = ref(false);
const physicalInventoryStore = usePhysicalInventoryStore();

/** ================================================
 * EVENTS
 ** ================================================*/
const eventRowInit = "event-initialize-row";
Event.on(eventRowInit, function (data) {
  return { inventory: data };
});

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return physicalInventoryStore.physicalInventories;
});

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await physicalInventoryStore.fetchAllPhysicalInventories();
});
</script>
