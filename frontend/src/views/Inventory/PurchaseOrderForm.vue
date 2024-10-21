<template>
  <VendorModal v-model="showVendorModal" v-if="showVendorModal" />
  <div class="flex flex-col gap-4">
    <div class="bg-white rounded-2xl p-4 shadow flex flex-col gap-3">
      <div class="flex justify-between items-center">
        <p
          class="text-base font-semibold text-success"
          v-if="status == PurchaseOrderStatus.COMPLETED"
        >
          Received Purchase Order
        </p>
        <p v-else class="text-base font-semibold">
          {{ isEdit ? "Edit" : "New" }} Purchase Order
        </p>
        <BadgeComponent
          v-if="isEdit && selectedStatus"
          :custom-class="selectedStatus.class"
          :text="selectedStatus.text"
        />
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex gap-3 max-[1180px]:flex-col">
          <div class="flex-1 flex flex-col gap-2">
            <p class="text-sm font-semibold">Order Info</p>
            <div class="flex flex-col gap-3">
              <div class="flex gap-3">
                <CustomInput
                  type="select"
                  class="flex-1"
                  :has-label="true"
                  label="Suppliers"
                  :has-add-new="true"
                  name="select_supplier"
                  :options="supplierOptions"
                  placeholder="*Select supplier"
                  v-model="model.order.supplier_id"
                  @add-new="showVendorModal = true"
                  :disabled="isEdit || isDisabled"
                />
                <CustomInput
                  type="select"
                  class="flex-1"
                  :has-label="true"
                  name="order_type"
                  label="Order Type"
                  placeholder="*Select Order Type"
                  v-model="model.order.type"
                  :options="[
                    {
                      text: 'Term',
                      value: PurchaseOrderType.TERM,
                    },
                    {
                      text: 'COD',
                      value: PurchaseOrderType.COD,
                    },
                  ]"
                  :disabled="isDisabled"
                />
              </div>
              <div class="flex gap-3">
                <CustomInput
                  type="text"
                  name="ref_no"
                  class="flex-1"
                  :has-label="true"
                  label="Reference No."
                  placeholder="Ref. No."
                  :disabled="isDisabled"
                  v-model="model.order.ref_no"
                />
                <CustomInput
                  type="date"
                  class="flex-1"
                  :has-label="true"
                  name="start_term"
                  label="Term Start"
                  :disabled="isDisabled"
                  placeholder="Term Start"
                  v-model="model.order.term_start"
                  v-if="model.order.type == PurchaseOrderType.TERM"
                />
              </div>
              <div class="flex gap-3">
                <CustomInput
                  type="date"
                  name="date"
                  label="Date"
                  :has-label="true"
                  class="flex-1 max-h-[38px]"
                  placeholder="Date"
                  v-model="model.order.date"
                  :disabled="isDisabled"
                />
                <CustomInput
                  type="date"
                  name="bill_due"
                  class="flex-1"
                  :has-label="true"
                  label="Bill due"
                  placeholder="Bill Due"
                  v-model="model.order.bill_due"
                  :disabled="isDisabled"
                />
              </div>
            </div>
          </div>
          <div class="flex-1 flex flex-col gap-2">
            <p class="text-sm font-semibold">Ship To Info</p>
            <AddressForm
              v-model="model.address"
              :has-label="true"
              :disabled="isDisabled"
            />
          </div>
        </div>
        <CustomInput
          name="memo"
          label="Memo"
          type="textarea"
          :has-label="true"
          placeholder="Memo"
          :disabled="isDisabled"
          input-class="resize-none"
          v-model="model.order.memo"
        />
      </div>

      <div class="flex justify-between items-center mt-6">
        <p class="text-base font-semibold">Select Products</p>
      </div>

      <div class="max-[750px]:w-[calc(100vw-328px)]">
        <div class="flex flex-col gap-4 max-w-full overflow-x-auto mb-4 pb-4">
          <PurchaseOrderFormHeader :is-disabled="isDisabled" />
          <div class="flex flex-col gap-4">
            <PurchaseOrderFormRow
              v-for="(product, ndx) in model.products"
              v-model="model.products[ndx]"
              :key="ndx"
              @remove="removeProduct(ndx)"
              :selected-products="model.products"
              :is-disabled="isDisabled"
              :sup_id="model.order.supplier_id.toString()"
            >
            </PurchaseOrderFormRow>
          </div>
          <div class="flex flex-col gap-4" v-if="!model.products.length">
            <p class="text-center text-sm">Table has no data!</p>
          </div>
        </div>
        <div class="flex justify-between items-center pb-3">
          <button
            class="btn w-fit"
            :class="[isDisabled ? 'pointer-events-none opacity-0' : '']"
            @click="addNewProduct"
          >
            Add new item
          </button>
          <p>
            Total: &#8369;
            {{
              model.order.amount.toLocaleString("en", {
                minimumFractionDigits: 2,
              })
            }}
          </p>
        </div>
      </div>

      <!-- buttons -->
      <div class="flex gap-3 justify-end mt-6">
        <RouterLink
          :to="{ name: 'purchase-order' }"
          class="btn-outline !border-danger !text-danger"
        >
          {{ isDisabled ? "Back" : "Cancel" }}
        </RouterLink>
        <button
          type="button"
          class="btn-outline"
          @click="onSubmit(true)"
          v-if="!isEdit"
        >
          Save and New
        </button>
        <button type="button" class="btn" @click="onSubmit()" v-if="!isEdit">
          Save
        </button>

        <!-- edit page save button -->
        <button
          type="button"
          class="btn"
          v-if="isEdit && !isDisabled"
          @click="onUpdate"
        >
          Update
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Method, authenticatedApi } from "@/api";
import PurchaseOrderFormRow from "@/components/Inventory/PurchaseOrder/PurchaseOrderFormRow.vue";
import PurchaseOrderFormHeader from "@/components/Inventory/PurchaseOrder/PurchaseOrderFormHeader.vue";
import AddressForm from "@/components/shared/AddressForm.vue";
import BadgeComponent from "@/components/shared/BadgeComponent.vue";
import CustomInput from "@/components/shared/CustomInput.vue";
import VendorModal from "@/components/Vendor/VendorModal.vue";
import { EventEnum } from "@/data/event";
import Event from "@/event";
import { getCost } from "@/helper";
import { useProductStore } from "@/stores/product";
import { usePurchaseOrderStore } from "@/stores/purchase-order";
import { useVendorStore } from "@/stores/supplier";
import { DateHelpers } from "shared";
import {
  PurchaseOrderStatus,
  PurchaseOrderType,
  PurchaseStatusMap,
} from "shared/enums/purchase-order";
import { ObjectHelpers } from "shared/helpers/object";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const isEdit = ref(false);
const router = useRouter();
const selectedStatus = ref();
const showVendorModal = ref(false);
const status = ref(PurchaseOrderStatus.OPEN);

const supplierStore = useVendorStore();
const purchaseOrderStore = usePurchaseOrderStore();
const productStore = useProductStore();

const modelDefualtValue = {
  order: {
    supplier_id: "",
    ref_no: "",
    date: DateHelpers.formatDate(new Date(), "YYYY-MM-DD"),
    bill_due: "",
    type: PurchaseOrderType.COD,
    memo: "",
    amount: 0,
    term_start: "",
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
    },
  ],
};

const model = ref(ObjectHelpers.copyObj(modelDefualtValue));

/** ================================================
 * EVENTS
 ** ================================================*/

// is page loading event
Event.emit(EventEnum.IS_PAGE_LOADING, true);

// Custom global event
const isCustomSelectFocused = ref(false);
Event.on("custom-select-focus", function (data) {
  isCustomSelectFocused.value = data;
});

/** ================================================
 * COMPUTED
 ** ================================================*/
const supplierOptions = computed(() => {
  return supplierStore.suppliers.map((supplier) => {
    return {
      value: supplier.id,
      text: supplier.company_name,
    };
  });
});

const orderStatus = ref();
const isDisabled = computed(() => {
  return orderStatus.value
    ? orderStatus.value == PurchaseOrderStatus.CANCELLED ||
        orderStatus.value == PurchaseOrderStatus.COMPLETED ||
        orderStatus.value == PurchaseOrderStatus.CONFIRMED
    : false;
});

/** ================================================
 * METHODS
 ** ================================================*/
const addNewProduct = () => {
  if (!isDisabled.value) {
    model.value.products.push({
      product_id: "",
      name: "",
      description: "",
      quantity: "",
      cost: "",
      amount: "",
    });
  }
};

const removeProduct = (ndx) => {
  model.value.products.splice(ndx, 1);
};

const onSubmit = async (isAddNew = false) => {
  // pre modification
  if (model.value.order.type == PurchaseOrderType.COD) {
    delete model.value.order.term_start;
  }

  const res = await authenticatedApi(
    "purchase-order/register",
    Method.POST,
    model.value
  );

  // reset model
  model.value.products = [];
  model.value.order = { ...modelDefualtValue.order };
  model.value.address = { ...modelDefualtValue.address };
  addNewProduct();

  if (res.status == 200) {
    if (!isAddNew) {
      router.push({
        name: "purchase-order",
      });
    }
  }
};

const onUpdate = async () => {
  if (route.query.id) {
    Event.emit(EventEnum.IS_PAGE_LOADING, true);
    const res = await authenticatedApi(
      `purchase-order/${route.query.id}/update`,
      Method.POST,
      model.value
    );

    if (res.status == 200) {
      console.log("Api is working and need to check the result in db");
    }
    Event.emit(EventEnum.IS_PAGE_LOADING, false);
  }
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await supplierStore.fetchAllSuppliers();
  await productStore.fetchAllProducts();
  if (route.query.id) {
    isEdit.value = true;
    await purchaseOrderStore.fetchPurchaseOrderById(route.query.id);
    status.value = purchaseOrderStore.purchaseOrder.status;
    const order = purchaseOrderStore.purchaseOrder;
    orderStatus.value = order.status;
    selectedStatus.value = PurchaseStatusMap[order.status];
    model.value.address = ObjectHelpers.assignSameFields(
      model.value.address,
      order.address
    );
    model.value.order = {
      supplier_id: order.supplier.id,
      amount: order.amount,
      bill_due: DateHelpers.formatDate(order.bill_due, "YYYY-MM-DD"),
      date: DateHelpers.formatDate(order.date, "YYYY-MM-DD"),
      memo: order.memo,
      ref_no: order.ref_no,
      type: order.type,
    };
    model.value.products = [
      ...order.products.map((product) => {
        return {
          product_id: product.id,
          name: product.name,
          description: product.ProductOrder.description
            ? product.ProductOrder.description
            : product.purchase_description,
          quantity: product.ProductOrder.quantity,
          cost: getCost(product.ProductOrder.cost, product, order.supplier_id),
          amount: product.ProductOrder.amount,
        };
      }),
    ];
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});

watch(
  () => model.value.order.supplier_id,
  (val) => {
    supplierStore.selectedSupplier = supplierStore.suppliers.find(
      (sup) => sup.id == val
    );

    // remove the products in the order which are not related to the supplier
    model.value.products = model.value.products.filter((prod) => {
      if (!prod.id) return true;
      const p = productStore.products.find((prd) => prd.id == prod.id);
      if (p) {
        return p.suppliers.map((sup) => sup.id).includes(val);
      }
    });
  }
);

watch(
  () => model.value.products,
  () => {
    if (model.value.products.length) {
      model.value.order.amount = model.value.products
        .map((prod) => prod.amount)
        .reduce((a, b) => a + b, 0);
    }
  },
  {
    deep: true,
  }
);
</script>
