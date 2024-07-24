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
      v-model:show-modal="showModal"
      v-model:is-edit="isEdit"
      :has-add-btn="false"
      class="relative"
    >
      <template v-slot:table_header>
        <div class="grid grid-cols-12 gap-3">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-2 table-header">Ref. No.</p>
          <p class="col-span-2 table-header">Supplier</p>
          <p class="col-span-1 table-header">Total</p>
          <p class="col-span-2 table-header">Date</p>
          <p class="col-span-2 table-header">Bill Due</p>
          <p class="col-span-1 table-header">Status</p>
          <p class="col-span-1 table-header">Actions</p>
        </div>
      </template>
      <template v-slot:table_body>
        <div class="flex flex-col gap-4">
          <PurchaseOrderRow
            @open-menu="onSelectRow"
            v-for="(order, ndx) in purchaseOrderStore.purchaseOrders"
            :key="ndx"
            :order="order"
          />
        </div>
      </template>
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
