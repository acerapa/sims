<template>
  <DeleteConfirmModal
    v-model="showDeleteConfirmation"
    v-if="showDeleteConfirmation"
    :data="toDelete"
    :href="'purchase-order/delete'"
  />
  <div class="flex flex-col gap-6">
    <RouterLink
      :to="{ name: 'purchase-order-create' }"
      class="btn w-fit"
      @click="
        showModal = true;
        isEdit = false;
      "
    >
      New Purchase Order
    </RouterLink>
    <CustomTable
      class="relative"
      :has-add-btn="false"
      :has-pagination="true"
      v-model:is-edit="isEdit"
      v-model:show-modal="showModal"
      :row-prop-init="purchaseOrderRowEvent"
      :table-row-component="PurchaseOrderRow"
      :data="purchaseOrderStore.purchaseOrders"
      :table-header-component="PurchaseOrderTableHeader"
      @open-menu="onSelectRow"
    >
      <RowMenu
        :top="top"
        v-if="showRowMenu"
        @view="onView"
        @delete="onDelete"
      />
    </CustomTable>
  </div>
</template>

<script setup>
import { usePurchaseOrderStore } from "@/stores/purchase-order";
import { onMounted, ref } from "vue";
import PurchaseOrderRow from "@/components/Inventory/PurchaseOrderRow.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import Event from "@/event";
import { useRouter } from "vue-router";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import PurchaseOrderTableHeader from "@/components/Inventory/PurchaseOrderTableHeader.vue";

const top = ref(0);
const toDelete = ref();
const selectedId = ref(0);
const isEdit = ref(false);
const showModal = ref(false);
const showRowMenu = ref(false);
const showDeleteConfirmation = ref(false);

const router = useRouter();

// custom event
Event.on("global-click", function () {
  showRowMenu.value = false;
});

// define purchase order props init
const purchaseOrderRowEvent = "purchase-order-row-props-init";
Event.on(purchaseOrderRowEvent, function (data) {
  return { order: data };
});

const onSelectRow = (id) => {
  selectedId.value = id;
  top.value = event.target.offsetTop;
  showRowMenu.value = true;
};

const onView = () => {
  router.push({
    name: "purchase-order-create",
    query: {
      id: selectedId.value,
    },
  });
};

const onDelete = () => {
  toDelete.value = {
    order_id: selectedId.value,
  };
  showDeleteConfirmation.value = true;
};

const purchaseOrderStore = usePurchaseOrderStore();

onMounted(async () => {
  await purchaseOrderStore.fetchPurchaseOrders();
});
</script>
