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
      <div class="grid grid-cols-9 gap-3">
        <p class="table-header col-span-2">Product Name</p>
        <p class="table-header col-span-1">Cost</p>
        <p class="table-header col-span-1">Ord Qty</p>
        <p class="table-header col-span-1">Amount</p>
        <p class="table-header col-span-1">Recv Qty</p>
        <p class="table-header col-span-2">Remarks</p>
        <p class="table-header col-span-1">status</p>
      </div>
      <div class="mt-6 flex flex-col gap-3">
        <div
          class="grid grid-cols-9 gap-3 items-center"
          v-for="(product, ndx) in model.products"
          :key="ndx"
        >
          <p class="text-sm col-span-2 h-[38px] py-2">
            {{ product.name }}
          </p>
          <p class="text-sm col-span-1 h-[38px] py-2">
            {{ product.cost }}
          </p>
          <p class="text-sm col-span-1 h-[38px] py-2">
            {{ product.quantity }}
          </p>
          <p class="text-sm col-span-1 h-[38px] py-2">
            {{ product.amount }}
          </p>
          <CustomInput
            type="number"
            name="quantity"
            class="col-span-1"
            v-model="product.quantity"
          />
          <CustomInput
            :rows="1"
            name="remarks"
            type="textarea"
            class="col-span-2"
            placeholder="Remarks"
            v-model="product.remarks"
          />
          <CustomInput
            type="select"
            name="status"
            v-model="product.status"
            class="w-full [&>select]:w-full"
            :options="productOrderStatusOptions"
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
      <button class="btn w-fit mx-auto" @click="onReceiveOrder">
        Receive Order
      </button>
    </div>
  </div>
</template>

<script setup>
import { authenticatedApi, Method } from "@/api";
import CustomInput from "@/components/shared/CustomInput.vue";
import { EventEnum } from "@/data/event";
import Event from "@/event";
import { getCost } from "@/helper";
import { usePurchaseOrderStore } from "@/stores/purchase-order";
import {
  ProductOrderedStatus,
  PurchaseOrderStatus,
  PurchaseOrderType,
} from "shared/enums/purchase-order";
import { DateHelpers, ObjectHelpers } from "shared/helpers";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const purchaseOrderStore = usePurchaseOrderStore();

const productOrderStatusOptions = [
  {
    text: "Open",
    value: ProductOrderedStatus.OPEN,
  },
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

const modelDefualtValue = {
  order: {
    supplier_id: "",
    ref_no: "",
    date: DateHelpers.formatDate(new Date(), "YYYY-MM-DD"),
    bill_due: "",
    type: PurchaseOrderType.COD,
    memo: "",
    amount: 0,
  },
  address: {
    address1: "",
    address2: "",
    city: "",
    postal: "",
  },
  products: [
    {
      product_id: "",
      name: "",
      description: "",
      quantity: "",
      cost: "",
      amount: "",
      remarks: "",
      status: "",
      quantity_received: "",
    },
  ],
};

const model = ref({ ...modelDefualtValue });

/** ================================================
 * EVENTS
 ** ================================================*/

Event.emit(EventEnum.IS_PAGE_LOADING, true);

/** ================================================
 * METHODS
 ** ================================================*/

const onCancel = () => {
  router.push({
    name: "purchase-order",
  });
};

const onReceiveOrder = async () => {
  const res = await authenticatedApi(
    `purchase-order/${route.params.id}/update`,
    Method.POST,
    model.value
  );

  if (res.status == 200) {
    await purchaseOrderStore.fetchPurchaseOrderById(route.params.id);
  }
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  if (route.params.id) {
    await purchaseOrderStore.fetchPurchaseOrderById(route.params.id);
    model.value.order = ObjectHelpers.assignSameFields(
      model.value.order,
      purchaseOrderStore.purchaseOrder
    );

    // few modification
    model.value.order.bill_due = DateHelpers.formatDate(
      model.value.order.bill_due,
      "YYYY-MM-DD"
    );
    model.value.order.date = DateHelpers.formatDate(
      model.value.order.date,
      "YYYY-MM-DD"
    );

    model.value.address = ObjectHelpers.assignSameFields(
      model.value.address,
      purchaseOrderStore.purchaseOrder.address
    );

    model.value.order.status = PurchaseOrderStatus.COMPLETED;

    model.value.products = [
      ...purchaseOrderStore.purchaseOrder.products.map((product) => {
        return {
          product_id: product.id,
          name: product.name,
          remarks: product.ProductOrder.remarks,
          description: product.ProductOrder.description
            ? product.ProductOrder.description
            : product.purchase_description,
          quantity: product.ProductOrder.quantity,
          status: product.ProductOrder.status
            ? product.ProductOrder.status
            : ProductOrderedStatus.OPEN,
          cost: getCost(
            product.ProductOrder.cost,
            product,
            purchaseOrderStore.purchaseOrder.supplier_id
          ),
          amount: product.ProductOrder.amount,
        };
      }),
    ];
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
