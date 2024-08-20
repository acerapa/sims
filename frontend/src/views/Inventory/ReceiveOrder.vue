<template>
  <div class="table-wrapper" v-if="purchaseOrderStore.purchaseOrder">
    <div class="flex flex-col gap-0">
      <p><b>PO #:</b> {{ purchaseOrderStore.purchaseOrder.id }}</p>
      <p>
        <b>Date Ordered #:</b>
        {{ DateHelpers.formatDate(purchaseOrderStore.purchaseOrder.date) }}
      </p>
      <p>
        <b>Supplier:</b>
        {{ purchaseOrderStore.purchaseOrder.supplier.company_name }}
      </p>
    </div>
    <hr class="-mx-4" />
    <div class="w-full">
      <div class="grid grid-cols-8 gap-3">
        <p class="table-header col-span-2">Product Name</p>
        <p class="table-header col-span-1">Cost</p>
        <p class="table-header col-span-1">Ordered Qty.</p>
        <p class="table-header col-span-1">Received Qty.</p>
        <p class="table-header col-span-2">Remarks</p>
        <p class="table-header col-span-1">status</p>
      </div>
      <div class="mt-6 flex flex-col gap-3">
        <div
          class="grid grid-cols-8 gap-3 items-center"
          v-for="(product, ndx) in purchaseOrderStore.purchaseOrder.products"
          :key="ndx"
        >
          <p class="text-sm col-span-2 h-[38px] py-2">
            {{ product.name }}
          </p>
          <p class="text-sm col-span-1 h-[38px] py-2">
            {{ product.cost }}
          </p>
          <p class="text-sm col-span-1 h-[38px] py-2">
            {{ product.ProductOrder.quantity }}
          </p>
          <input
            type="number"
            class="input col-span-1"
            :value="product.ProductOrder.quantity"
          />
          <textarea class="input col-span-2" rows="1" name="" id=""></textarea>
          <CustomSelectInput
            :options="productOrderStatusOptions"
            class="w-full [&>select]:w-full"
            placeholder="Select Ordered Product Status"
          />
        </div>
      </div>
    </div>
    <div class="flex gap-3 mt-5 w-fit ml-auto mr-0">
      <button
        class="btn-outline !border-danger !text-danger w-fit mx-auto"
        @click="onCancel"
      >
        Cancel
      </button>
      <button class="btn w-fit mx-auto">Receive Order</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { usePurchaseOrderStore } from "@/stores/purchase-order";
import { DateHelpers } from "shared";
import { useRoute, useRouter } from "vue-router";
import CustomSelectInput from "@/components/shared/CustomSelectInput.vue";
import { ProductOrderedStatus } from 'shared/enums/purchase-order'

const route = useRoute();
const router = useRouter();
const purchaseOrderStore = usePurchaseOrderStore();

const productOrderStatusOptions = [
  {
    text: "Complete",
    value: ProductOrderedStatus.COMPLETE,
  },
  {
    text: "Incomplete",
    value: ProductOrderedStatus.INCOMPLETE,
  },
  {
    text: "Not Received",
    value: ProductOrderedStatus.NOT_RECEIVED,
  },
];

onMounted(async () => {
  if (route.params.id) {
    await purchaseOrderStore.fetchPurchaseOrderById(route.params.id);
  }
});

const onCancel = () => {
  router.push({
    name: "purchase-order",
  });
};

const showModal = ref(false);
</script>
