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
      @open-menu="onSelectRow"
    >
      <RowMenu v-if="showRowMenu" :top="top" @view="onView" />
    </CustomTable>
  </div>
</template>

<script setup>
import Event from "@/event";
import { computed, onMounted, ref } from "vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import { usePhysicalInventoryStore } from "@/stores/physical-inventory";
import PhysicalInventoryRow from "@/components/Inventory/PhysicalInventoryRow.vue";
import PhysicalInventoryCreateModal from "@/components/Inventory/PhysicalInventoryCreateModal.vue";
import PhysicalInventoryTableHeader from "@/components/Inventory/PhysicalInventoryTableHeader.vue";
import { EventEnum } from "@/data/event";
import { useRouter } from "vue-router";

const top = ref(0);
const selectedId = ref(0);
const router = useRouter();
const showRowMenu = ref(false);
const showCreationModal = ref(false);
const physicalInventoryStore = usePhysicalInventoryStore();

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

Event.on(EventEnum.GLOBAL_CLICK, function () {
  showRowMenu.value = false;
});

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
 * METHODS
 ** ================================================*/
const onSelectRow = (id) => {
  top.value = event.target.offsetTop;
  showRowMenu.value = true;
  selectedId.value = id;
};

const onView = () => {
  router.push({
    name: "physical-inventory-details",
    params: {
      id: selectedId.value,
    },
  });
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await physicalInventoryStore.fetchAllPhysicalInventories();
  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
