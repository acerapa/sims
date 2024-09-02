<template>
  <div>Physical Inventory details</div>
</template>

<script setup>
import Event from "@/event";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { EventEnum } from "@/data/event";
import { usePhysicalInventoryStore } from "@/stores/physical-inventory";

const route = useRoute();
const physicalInventoryStore = usePhysicalInventoryStore();

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  if (route.params.id) {
    await physicalInventoryStore.fetchOne(route.params.id);
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
