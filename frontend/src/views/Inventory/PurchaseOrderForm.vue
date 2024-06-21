<template>
  <PurchaseOrderAddProductModal v-model="showModal" v-if="showModal" />
  <div class="flex flex-col gap-4">
    <div class="bg-white rounded-2xl p-4 shadow flex flex-col gap-3">
      <p class="text-base font-semibold">New Purchase Order</p>
      <div class="flex flex-col gap-3">
        <div class="flex gap-3">
          <div class="flex-1 flex flex-col gap-2">
            <p class="text-sm font-semibold">Order Info</p>
            <div class="flex flex-col gap-3">
              <div class="flex-1 flex flex-col">
                <select
                  name=""
                  id=""
                  class="input"
                  v-model="model.supplier_id"
                  :disabled="!supplierStore.suppliers.length"
                >
                  <option value="" hidden>*Select Supplier</option>
                  <option value="ADD NEW">&lt;&lt;Add New&gt;&gt;</option>
                  <option
                    v-for="(sup, ndx) in supplierStore.suppliers"
                    :value="sup.id"
                    :key="ndx"
                  >
                    {{ sup.company_name }}
                  </option>
                </select>
                <RouterLink
                  v-if="!supplierStore.suppliers.length"
                  :to="{ name: 'vendors' }"
                  class="text-center"
                >
                  <small class="text-red-500"
                    >***Please add suppliers first, just
                    <small class="text-blue-500">click here</small>***</small
                  >
                </RouterLink>
              </div>
              <input type="text" class="input" placeholder="Ref. No." />
              <div class="flex gap-3">
                <input
                  type="text"
                  class="flex-1 input"
                  placeholder="Date"
                  @focus="$event.target.type = 'date'"
                  @blur="$event.target.type = 'text'"
                />
                <input
                  type="text"
                  class="flex-1 input"
                  placeholder="Bill Due"
                  @focus="$event.target.type = 'date'"
                  @blur="$event.target.type = 'text'"
                />
              </div>
            </div>
          </div>
          <div class="flex-1 flex flex-col gap-2">
            <p class="text-sm font-semibold">Address Info</p>
            <AddressForm />
          </div>
        </div>
        <textarea
          name=""
          id=""
          class="input resize-none"
          placeholder="Memo"
        ></textarea>
      </div>

      <div class="flex justify-between items-center mt-6">
        <p class="text-base font-semibold">Select Products</p>
        <button
          class="bg-primary p-2 rounded"
          @click="
            showModal = true;
            isEdit = false;
          "
        >
          <img src="@/assets/icons/plus.svg" alt="Plus" />
        </button>
      </div>

      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-9 gap-3">
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
        <hr class="bg-gray-50 -mx-4" />
        <div class="flex flex-col gap-4">
          <PurchaseOrderFormRow
            v-for="(order, ndx) in orders"
            :order="order"
            :key="ndx"
          />
        </div>
      </div>

      <!-- buttons -->
      <div class="flex gap-3 justify-end mt-6">
        <RouterLink
          :to="{ name: 'purchase-order' }"
          class="btn-outline !border-danger !text-danger"
          >Cancel</RouterLink
        >
        <button type="button" class="btn-outline">Save and New</button>
        <button type="button" class="btn" @click="onSubmit">Save</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useVendorStore } from "@/stores/supplier";
import { onMounted, ref } from "vue";
import AddressForm from "@/components/shared/AddressForm.vue";
import PurchaseOrderFormRow from "../../components/Inventory/PurchaseOrderFormRow.vue";
import { useRouter } from "vue-router";
import PurchaseOrderAddProductModal from "@/components/Inventory/PurchaseOrderAddProductModal.vue";

const showModal = ref(true);
const isEdit = ref(false);
const supplierStore = useVendorStore();
const router = useRouter();

// fake data
const orders = [
  {
    product: {
      item_code: "sample-code",
      purchase_description: "This is a sample description",
      purchase_price: 500,
    },
    quantity: 5,
    amount: 2500,
  },
  {
    product: {
      item_code: "sample-code",
      purchase_description: "This is a sample description",
      purchase_price: 500,
    },
    quantity: 5,
    amount: 2500,
  },
];

const model = ref({
  supplier_id: "",
});

onMounted(async () => {
  await supplierStore.fetchAllSuppliers();
});

const onSubmit = async () => {
  router.push({
    name: "purchase-order",
  });
};
</script>
