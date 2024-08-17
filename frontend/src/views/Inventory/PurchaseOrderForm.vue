<template>
  <VendorModal v-model="showVendorModal" v-if="showVendorModal" />
  <div class="flex flex-col gap-4">
    <div class="bg-white rounded-2xl p-4 shadow flex flex-col gap-3">
      <div class="flex justify-between items-center">
        <p class="text-base font-semibold">
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
                <CustomSelectInput
                  :has-add-new="true"
                  :options="supplierOptions"
                  placeholder="*Select supplier"
                  v-model="model.order.supplier_id"
                  @add-new="showVendorModal = true"
                  class="flex-1"
                />
                <CustomSelectInput
                  class="flex-1"
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
                />
              </div>
              <input
                type="text"
                class="input"
                v-model="model.order.ref_no"
                placeholder="Ref. No."
              />
              <div class="flex gap-3">
                <input
                  type="text"
                  class="flex-1 input"
                  placeholder="Date"
                  @focus="$event.target.type = 'date'"
                  @blur="$event.target.type = 'text'"
                  v-model="model.order.date"
                />
                <input
                  type="text"
                  class="flex-1 input"
                  placeholder="Bill Due"
                  @focus="$event.target.type = 'date'"
                  @blur="$event.target.type = 'text'"
                  v-model="model.order.bill_due"
                />
              </div>
            </div>
          </div>
          <div class="flex-1 flex flex-col gap-2">
            <p class="text-sm font-semibold">Ship To Info</p>
            <AddressForm
              v-model="model.address"
              :address="model.address"
              :key="model.order"
            />
          </div>
        </div>
        <textarea
          name=""
          id=""
          class="input resize-none"
          placeholder="Memo"
          v-model="model.order.memo"
        ></textarea>
      </div>

      <div class="flex justify-between items-center mt-6">
        <p class="text-base font-semibold">Select Products</p>
      </div>

      <div class="max-[750px]:w-[calc(100vw-328px)]">
        <div class="flex flex-col gap-4 max-w-full overflow-x-auto mb-4 pb-4">
          <div class="grid grid-cols-9 gap-3 min-w-[750px] pb-2 border-b">
            <div class="col-span-2 flex gap-3 items-center">
              <input type="checkbox" class="input" />
              <p class="table-header">Item</p>
            </div>
            <p class="col-span-3 table-header">Description</p>
            <p class="col-span-1 table-header">Qty</p>
            <p class="col-span-1 table-header">Cost</p>
            <p class="col-span-1 table-header">Amount</p>
            <p class="col-span-1 table-header">Action</p>
          </div>
          <div class="flex flex-col gap-4">
            <PurchaseOrderFormRow
              v-for="(product, ndx) in model.products"
              v-model="model.products[ndx]"
              :key="ndx"
              @remove="removeProduct(ndx)"
              :selected-products="model.products"
            >
            </PurchaseOrderFormRow>
          </div>
          <div class="flex flex-col gap-4" v-if="!model.products.length">
            <p class="text-center text-sm">Table has no data!</p>
          </div>
        </div>
        <div class="flex justify-between items-center pb-3">
          <button class="btn w-fit" @click="addNewProduct">Add new item</button>
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
          >Cancel</RouterLink
        >
        <button type="button" class="btn-outline" v-if="!isEdit">
          Save and New
        </button>
        <button type="button" class="btn" @click="onSubmit()" v-if="!isEdit">
          Save
        </button>

        <!-- edit page save button -->
        <button type="button" class="btn" v-if="isEdit" @click="onUpdate">
          Update
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useVendorStore } from "@/stores/supplier";
import { computed, onMounted, ref, watch } from "vue";
import AddressForm from "@/components/shared/AddressForm.vue";
import PurchaseOrderFormRow from "../../components/Inventory/PurchaseOrderFormRow.vue";
import { useRoute, useRouter } from "vue-router";
import CustomSelectInput from "@/components/shared/CustomSelectInput.vue";
import VendorModal from "@/components/Vendor/VendorModal.vue";
import { Method, authenticatedApi } from "@/api";
import { DateHelpers } from "shared";
import { useProductStore } from "@/stores/product";
import { usePurchaseOrderStore } from "@/stores/purchase-order";
import BadgeComponent from "@/components/shared/BadgeComponent.vue";
import { PurchaseStatusMap } from "shared/enums/purchase-order";
import { ObjectHelpers } from "shared/helpers/object";
import Event from "@/event";
import { PurchaseOrderType } from "shared/enums/purchase-order";

const route = useRoute();
const isEdit = ref(false);
const router = useRouter();
const selectedStatus = ref();
const showVendorModal = ref(false);

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

const model = ref({ ...modelDefualtValue });

const supplierOptions = computed(() => {
  return supplierStore.suppliers.map((supplier) => {
    return {
      value: supplier.id,
      text: supplier.company_name,
    };
  });
});

// Custom global event
const isCustomSelectFocused = ref(false);
Event.on("custom-select-focus", function (data) {
  isCustomSelectFocused.value = data;
});

onMounted(async () => {
  await supplierStore.fetchAllSuppliers();
  await productStore.fetchAllProducts();
  if (route.query.id) {
    isEdit.value = true;
    await purchaseOrderStore.fetchPurchaseOrderById(route.query.id);
    const order = purchaseOrderStore.purchaseOrder;
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
          description: product.purchase_description,
          quantity: product.ProductOrder.quantity,
          cost: product.ProductOrder.cost,
          amount: product.ProductOrder.amount,
        };
      }),
    ];
  }
});

const addNewProduct = () => {
  model.value.products.push({
    product_id: "",
    name: "",
    description: "",
    quantity: "",
    cost: "",
    amount: "",
  });
};

const removeProduct = (ndx) => {
  model.value.products.splice(ndx, 1);
};

const onSubmit = async (isAddNew = false) => {
  const res = await authenticatedApi(
    "purchase-order/register",
    Method.POST,
    model.value
  );

  // reset model
  model.value = { ...modelDefualtValue };

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
    const res = await authenticatedApi(
      `purchase-order/${route.query.id}/update`,
      Method.POST,
      model.value
    );

    if (res.status == 200) {
      console.log("Api is working and need to check the result in db");
    }
  }
};

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
