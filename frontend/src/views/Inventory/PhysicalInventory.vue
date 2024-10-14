<template>
  <DeleteConfirmModal
    v-model="showDeleteConfirmModal"
    v-if="showDeleteConfirmModal"
    href="physical-inventory/delete"
    :data="toDelete"
    @after-delete="afterDelete"
  />
  <div class="flex flex-col gap-6">
    <button class="btn w-fit" @click="onStartPhysicalInventory">
      Start Physical Inventory
    </button>
    <CustomTable
      :has-add-btn="false"
      :data="filteredData"
      :row-prop-init="eventRowInit"
      :table-row-component="PhysicalInventoryRow"
      :table-header-component="PhysicalInventoryTableHeader"
      @open-menu="onSelectRow"
    >
      <RowMenu
        v-if="showRowMenu"
        :top="top"
        @view="onView"
        @delete="onDelete"
      />
    </CustomTable>
  </div>
</template>

<script setup>
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import PhysicalInventoryRow from "@/components/Inventory/PhysicalInventory/PhysicalInventoryRow.vue";
import PhysicalInventoryTableHeader from "@/components/Inventory/PhysicalInventory/PhysicalInventoryTableHeader.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import { EventEnum } from "@/data/event";
import Event from "@/event";
import { useAuthStore } from "@/stores/auth";
import { usePhysicalInventoryStore } from "@/stores/physical-inventory";
import { useProductStore } from "@/stores/product";
import { PhysicalInventoryStatus } from "shared/enums/purchase-order";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const top = ref(0);
const toDelete = ref();
const selectedId = ref(0);
const router = useRouter();
const showRowMenu = ref(false);
const authStore = useAuthStore();
const productStore = useProductStore();
const showDeleteConfirmModal = ref(false);
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
const onStartPhysicalInventory = async () => {
  const model = {
    physical_inventory: {
      date_started: new Date(),
      status: PhysicalInventoryStatus.DRAFT,
      inventory_incharge: authStore.getAuthUser().id,
      branch_manager: authStore.getAuthUser().id, // temporary for now (supposedly need to set branch manager in the system)
      date_ended: null,
    },
    items: [],
  };
  // fetch all products
  await productStore.fetchAllProducts();

  model.items = productStore.products.map((product) => {
    return {
      quantity: product.quantity_in_stock,
      physical_quantity: 0,
      product_id: product.id,
      physical_inventory_id: 0,
    };
  });

  console.log(model);
  const res = await physicalInventoryStore.register(model);

  if (res.status == 200) {
    router.push({
      name: "physical-inventory-details",
      params: {
        id: res.data.physical_inventory.id,
      },
    });
  }
};

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

const onDelete = () => {
  toDelete.value = {
    id: selectedId.value,
  };
  showDeleteConfirmModal.value = true;
};

const afterDelete = async () => {
  showDeleteConfirmModal.value = false;
  await physicalInventoryStore.fetchAllPhysicalInventories();
};
/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await physicalInventoryStore.fetchAllPhysicalInventories();
  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
