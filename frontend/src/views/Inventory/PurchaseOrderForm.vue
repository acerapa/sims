<template>
  <VendorModal v-model="showVendorModal" v-if="showVendorModal" />
  <div class="flex flex-col gap-4">
    <div class="bg-white rounded-2xl p-4 shadow flex flex-col gap-3">
      <p class="text-base font-semibold">New Purchase Order</p>
      <div class="flex flex-col gap-3">
        <div class="flex gap-3 max-[1180px]:flex-col">
          <div class="flex-1 flex flex-col gap-2">
            <p class="text-sm font-semibold">Order Info</p>
            <div class="flex flex-col gap-3">
              <CustomSelectInput
                :has-add-new="true"
                :options="supplierOptions"
                placeholder="*Select supplier"
                v-model="model.order.supplier_id"
                @add-new="showVendorModal = true"
              />
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
              v-model="model.order.address"
              :address="model.order.address"
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
          <div
            class="grid grid-cols-9 gap-3 min-w-[750px] pb-2 border-b"
          >
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
              v-for="(order, ndx) in model.products"
              v-model="model.products[ndx]"
              :key="ndx"
              @remove="removeProduct(ndx)"
              :selected-products="model.products"
            />
          </div>
          <div class="flex flex-col gap-4" v-if="!model.products.length">
            <p class="text-center text-sm">Table has no data!</p>
          </div>
        </div>
        <div class="flex justify-between items-center pb-3">
          <button class="btn w-fit" @click="addNewProduct">
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
          >Cancel</RouterLink
        >
        <button type="button" class="btn-outline" v-if="!isEdit">
          Save and New
        </button>
        <button type="button" class="btn" @click="onSubmit()" v-if="!isEdit">
          Save
        </button>

        <!-- edit page save button -->
        <button type="button" class="btn" v-if="isEdit">Update</button>
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
import { Helpers } from "@/helpers";
import { useProductStore } from "@/stores/product";
import { usePurchaseOrderStore } from "@/stores/purchase-order";
import Event from "@/event";

const route = useRoute();
const isEdit = ref(false);
const router = useRouter();
const showVendorModal = ref(false);

const supplierStore = useVendorStore();
const purchaseOrderStore = usePurchaseOrderStore();
const productStore = useProductStore();

const modelDefualtValue = {
  order: {
    supplier_id: "",
    ref_no: "",
    date: Helpers.formatDate(new Date(), "YYYY-MM-DD"),
    bill_due: "",
    memo: "",
    amount: 0,
    address: {
      address1: "",
      address2: "",
      city: "",
      postal: "",
    },
  },
  products: [
    {
      id: "",
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

const isCustomSelectFocused = ref(false);
// Custom global event
Event.on("custom-select-focus", function (data) {
  isCustomSelectFocused.value = data;
});

onMounted(async () => {
  if (route.query.id) {
    isEdit.value = true;
    await purchaseOrderStore.fetchPurchaseOrderById(route.query.id);

    const order = purchaseOrderStore.purchaseOrder;
    model.value = {
      order: {
        address: order.address,
        supplier_id: order.supplier.id,
        amount: order.amount,
        bill_due: Helpers.formatDate(order.bill_due, "YYYY-MM-DD"),
        date: Helpers.formatDate(order.date, "YYYY-MM-DD"),
        memo: "",
        ref_no: order.ref_no,
      },
      products: [
        ...order.products.map((product) => {
          return {
            id: product.id,
            name: product.name,
            description: product.description,
            quantity: product.ProductOrder.quantity,
            cost: product.cost,
            amount: product.ProductOrder.amount,
          };
        }),
      ],
    };
  }
  await supplierStore.fetchAllSuppliers();
});

const addNewProduct = () => {
  model.value.products.push({
    id: "",
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
  const res = authenticatedApi(
    "purchase-order/register",
    Method.POST,
    model.value
  );

  // reset model
  model.value = { ...modelDefualtValue };

  if (!isAddNew) {
    router.push({
      name: "purchase-order",
    });
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
