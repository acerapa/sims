<template>
  <div class="flex flex-col gap-3">
    <div class="cont flex flex-col gap-3" v-if="physicalInventory">
      <div class="flex justify-between">
        <div>
          <p>
            <strong>Physical Inventory for date:</strong>
            {{ DateHelpers.formatDate(physicalInventory.date, "MM/DD/YYYY") }}
          </p>
        </div>
        <BadgeComponent
          :text="PhysicalInventoryStatusMap[physicalInventory.status].text"
          :class="PhysicalInventoryStatusMap[physicalInventory.status].class"
        />
      </div>
    </div>
    <CustomTable
      :has-filter="true"
      :has-add-btn="false"
      :data="filteredData"
      :has-pagination="true"
      :table-row-component="PhysicalInventoryRow"
      :table-header-component="PhysicalInventoryItemHeader"
    ></CustomTable>
  </div>
</template>

<script setup>
import Event from "@/event";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { EventEnum } from "@/data/event";
import { DateHelpers } from "shared/helpers";
import CustomTable from "@/components/shared/CustomTable.vue";
import BadgeComponent from "@/components/shared/BadgeComponent.vue";
import { PhysicalInventoryStatus } from "shared/enums/purchase-order";
import { usePhysicalInventoryStore } from "@/stores/physical-inventory";
import PhysicalInventoryRow from "@/components/Inventory/PhysicalInventoryRow.vue";
import PhysicalInventoryItemHeader from "@/components/Inventory/PhysicalInventoryItemHeader.vue";

const route = useRoute();
const physicalInventory = ref();
const physicalInventoryStore = usePhysicalInventoryStore();

const PhysicalInventoryStatusMap = {
  [PhysicalInventoryStatus.DRAFT]: {
    text: "Draft",
    class: "draft",
  },
  [PhysicalInventoryStatus.DONE]: {
    text: "Done",
    class: "done",
  },
};

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return [];
});

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  if (route.params.id) {
    await physicalInventoryStore.fetchOne(route.params.id);
    physicalInventory.value = physicalInventoryStore.physicalInventory;
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
