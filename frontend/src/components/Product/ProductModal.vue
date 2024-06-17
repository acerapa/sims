<template>
  <ModalWrapper :title="title" v-model="showModal" @submit="onSubmit">
    <div class="flex flex-col gap-6 my-7">
      <div class="flex flex-col gap-3 w-[calc(50%-6px)]">
        <p class="text-base font-semibold">Product Type</p>
        <select class="input" v-model="model.type">
          <option value="" hidden>Select type</option>
          <option value="inventory">Inventory</option>
          <option value="non-inventory">Non Inventory</option>
        </select>
      </div>
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Basic Info</p>
        <div class="flex flex-col gap-4">
          <div class="flex gap-3">
            <input
              type="text"
              class="input flex-1"
              placeholder="*Name"
              v-model="model.name"
            />
            <input
              type="text"
              class="input flex-1"
              placeholder="*Brand"
              v-model="model.brand"
            />
          </div>
          <div class="flex gap-3 items-start">
            <div class="flex-1 flex flex-col">
              <select
                name=""
                id=""
                class="input"
                v-model="model.supplier_id"
                :disabled="!supplierStore.suppliers.length"
              >
                <option value="" hidden>*Select Preferred Supplier</option>
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
            <div class="flex-1 flex flex-col">
              <select
                name=""
                id=""
                class="input"
                v-model="model.category_id"
                :disabled="!settingStore.productCategories.length"
              >
                <option value="" hidden>*Category</option>
                <option
                  v-for="(category, ndx) in settingStore.productCategories"
                  :key="ndx"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
              <RouterLink
                v-if="!settingStore.productCategories.length"
                :to="{ name: 'product-categories' }"
                class="text-center"
              >
                <small class="text-red-500"
                  >***Please add categories first, just
                  <small class="text-blue-500">click here</small>***</small
                >
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Inventory and Sales info</p>
        <div class="flex flex-col gap-4">
          <div class="flex gap-3">
            <input
              type="number"
              class="input flex-1"
              placeholder="Purchase Price"
              v-model="model.purchase_price"
            />
            <input
              type="number"
              class="input flex-1"
              placeholder="Sale Price"
              v-model="model.selling_price"
            />
          </div>
          <div class="flex gap-3 items-start">
            <div class="flex-1 flex flex-col">
              <select
                name=""
                id=""
                class="input flex-1"
                :disabled="!incomeAccounts.length"
              >
                <option value="" hidden>Income Account</option>
                <option
                  v-for="(acc, npx) in incomeAccounts"
                  :key="npx"
                  :value="acc.id"
                >
                  {{ acc.name }}
                </option>
              </select>
              <RouterLink
                v-if="!incomeAccounts.length"
                :to="{ name: 'account-settings' }"
                class="text-center"
              >
                <small class="text-red-500"
                  >***Please add income accounts first, just
                  <small class="text-blue-500">click here</small>***</small
                >
              </RouterLink>
            </div>
            <div class="flex-1 flex flex-col">
              <select
                name=""
                id=""
                class="input flex-1"
                :disabled="!expenseAccounts.length"
              >
                <option value="" hidden>Expense Account</option>
                <option
                  v-for="(acc, npx) in expenseAccounts"
                  :key="npx"
                  :value="acc.id"
                >
                  {{ acc.name }}
                </option>
              </select>
              <RouterLink
                v-if="!expenseAccounts.length"
                :to="{ name: 'account-settings' }"
                class="text-center"
              >
                <small class="text-red-500"
                  >***Please add expense accounts first, just
                  <small class="text-blue-500">click here</small>***</small
                >
              </RouterLink>
            </div>
          </div>
          <div class="flex gap-3">
            <input
              type="number"
              class="input flex-1"
              placeholder="Quantity in stock"
              v-model="model.quantityInStock"
            />
            <input
              type="number"
              class="input flex-1"
              placeholder="Item Code"
              v-model="model.item_code"
            />
          </div>
          <div class="flex gap-3 items-start">
            <textarea
              name=""
              id=""
              rows="5"
              class="input flex-1"
              placeholder="Purchase Description"
              v-model="model.purchase_description"
            ></textarea>
            <textarea
              name=""
              id=""
              rows="5"
              class="input flex-1"
              placeholder="Seles Description"
              v-model="model.selling_description"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </ModalWrapper>
</template>

<script setup>
import { Method, authenticatedApi } from "@/api";
import ModalWrapper from "@/components/wrappers/ModalWrapper.vue";
import { useProductStore } from "@/stores/product";
import { useSettingsStore } from "@/stores/settings";
import { useVendorStore } from "@/stores/supplier";
import { computed, onMounted, ref } from "vue";
import { AccountType } from "@/types/enums";

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  selectedId: {
    type: Number,
  },
});

const showModal = defineModel();

const model = ref({
  name: "",
  purchase_description: "",
  selling_description: "",
  purchase_price: "",
  selling_price: "",
  item_code: "",
  category: "",
  brand: "",
  quantityInStock: "",
  imageUrl: "",
  status: "",
  type: "",
  category_id: "",
  supplier_id: "",
});

const title = ref(props.isEdit ? "Edit Product" : "New Product");
const apiPath = ref(props.isEdit ? "products/update" : "products/register");

const productStore = useProductStore();
const supplierStore = useVendorStore();
const settingStore = useSettingsStore();

const incomeAccounts = computed(() => {
  return settingStore.accounts.filter(
    (acc) => acc.type == AccountType.income.value
  );
});

const expenseAccounts = computed(() => {
  return settingStore.accounts.filter(
    (acc) => acc.type == AccountType.expense.value
  );
});

onMounted(() => {
  console.log(props.isEdit, props.selectedId);
  if (props.isEdit && props.selectedId) {
    model.value = productStore.products.find(
      (product) => product.id == props.selectedId
    );
  }
});

const onSubmit = async () => {
  await authenticatedApi(apiPath.value, Method.POST, model.value);
  await productStore.fetchAllProducts();
  showModal.value = false;
};
</script>
