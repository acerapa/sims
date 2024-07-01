<template>
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
    <div class="table-wrapper">
      <div class="flex justify-between items-center">
        <input
          type="search"
          class="input w-full max-w-72"
          placeholder="Search"
        />
      </div>
      <hr class="bg-gray-50 -mx-4" />
      <div class="flex flex-col gap-7 overflow-x-auto pb-5">
        <div class="grid grid-cols-12 gap-3">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-2 table-header">Ref. No.</p>
          <p class="col-span-2 table-header">Supplier</p>
          <p class="col-span-1 table-header">Amount</p>
          <p class="col-span-2 table-header">Date</p>
          <p class="col-span-2 table-header">Bill Due</p>
          <p class="col-span-1 table-header">Status</p>
          <p class="col-span-1 table-header">Actions</p>
        </div>
        <div class="flex flex-col gap-4">
          <PurchaseOrderRow
            v-for="(order,ndx) in purchaseOrderStore.purchaseOrders"
            :key="ndx"
            :order="order"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePurchaseOrderStore } from "@/stores/purchase-order";
import { onMounted, ref } from "vue";
import PurchaseOrderRow from "@/components/Inventory/PurchaseOrderRow.vue";

const showModal = ref(false);
const isEdit = ref(false);

const purchaseOrderStore = usePurchaseOrderStore();

onMounted(async () => {
  await purchaseOrderStore.fetchPurchaseOrders();
});
</script>
