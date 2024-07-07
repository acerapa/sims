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
            <CustomSelectInput
              placeholder="*Select Suppliers"
              class="flex-1"
              :has-add-new="true"
              :select-multiple="true"
              :options="supplierOptions"
              @add-new="showVendorModal = true"
              v-model="model.suppliers"
            />
            <CustomSelectInput
              placeholder="*Select Category"
              class="flex-1"
              :has-add-new="true"
              :options="categoriesOptions"
              @add-new="showCategoryModal = true"
              v-model="model.category_id"
            />
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
              placeholder="Cost Price"
              v-model="model.cost"
            />
            <input
              type="number"
              class="input flex-1"
              placeholder="Sale Price"
              v-model="model.price"
            />
          </div>
          <div class="flex gap-3 items-start">
            <CustomSelectInput
              placeholder="*Select Income Account"
              class="flex-1"
              :has-add-new="true"
              :options="incomeAccounts"
              @add-new="showAccountModal = true"
              v-model="model.income_account"
            />
            <CustomSelectInput
              placeholder="*Select Expense Account"
              class="flex-1"
              :has-add-new="true"
              :options="expenseAccounts"
              @add-new="showAccountModal = true"
              v-model="model.expense_account"
            />
          </div>
          <div class="flex gap-3">
            <input
              type="number"
              class="input flex-1"
              placeholder="Quantity in stock"
              v-model="model.quantity_in_stock"
            />
            <input
              type="text"
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
              placeholder="Sales Description"
              v-model="model.sale_description"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </ModalWrapper>
  <VendorModal v-if="showVendorModal" v-model="showVendorModal" />
  <AccountModal v-if="showAccountModal" v-model="showAccountModal" />
  <ProductCategoryModal v-if="showCategoryModal" v-model="showCategoryModal" />
</template>

<script setup>
import { Method, authenticatedApi } from "@/api";
import ModalWrapper from "@/components/shared/ModalWrapper.vue";
import CustomSelectInput from "../shared/CustomSelectInput.vue";
import ProductCategoryModal from "../Settings/ProductCategoryModal.vue";
import AccountModal from "../Settings/AccountModal.vue";
import VendorModal from "../Vendor/VendorModal.vue";
import { computed, onMounted, ref } from "vue";
import { AccountType } from "@/types/enums";

import { useVendorStore } from "@/stores/supplier";
import { useSettingsStore } from "@/stores/settings";
import { useProductStore } from "@/stores/product";

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  selectedId: {
    type: Number,
    required: false,
  },
});

const emit = defineEmits(["newAccount"]);

const showModal = defineModel();
const showAccountModal = ref(false);
const showCategoryModal = ref(false);
const showVendorModal = ref(false);

const model = ref({
  name: "",
  purchase_description: "",
  sale_description: "",
  cost: "",
  price: "",
  item_code: "",
  brand: "",
  quantity_in_stock: "",
  status: "",
  type: "",
  category_id: "",
  suppliers: [],
  income_account: "",
  expense_account: "",
});

const title = ref(props.isEdit ? "Edit Product" : "New Product");
const apiPath = ref(props.isEdit ? "products/update" : "products/register");

const supplierStore = useVendorStore();
const settingStore = useSettingsStore();
const productStore = useProductStore();

const incomeAccounts = computed(() => {
  return settingStore.accounts
    .filter((acc) => acc.type == AccountType.income.value)
    .map((acc) => {
      return {
        text: acc.name,
        value: acc.id,
      };
    });
});

const expenseAccounts = computed(() => {
  return settingStore.accounts
    .filter((acc) => acc.type == AccountType.expense.value)
    .map((acc) => {
      return {
        text: acc.name,
        value: acc.id,
      };
    });
});

const supplierOptions = computed(() => {
  return supplierStore.suppliers.map((supplier) => {
    return {
      value: supplier.id,
      text: supplier.company_name,
    };
  });
});

const categoriesOptions = computed(() => {
  return settingStore.productCategories.map((category) => {
    return {
      value: category.id,
      text: category.name,
    };
  });
});

const generateItemCode = async () => {
  const res = await authenticatedApi("products/item-code");
  if (res.status == 200) {
    model.value.item_code = res.data.item_code;
  }
};

onMounted(async () => {
  await supplierStore.fetchAllSuppliers();
  await settingStore.fetchAllProductCategories();
  await settingStore.fetchAllAccounts();

  if (props.isEdit && props.selectedId) {
    model.value = (() => {
      let product = productStore.products.find(
        (product) => product.id == props.selectedId
      );

      // remove pass by reference
      product = { ...product };

      if (product) {
        if (product.suppliers.length) {
          product.cost = product.suppliers[0].ProductSupplier.cost;
          product.suppliers = product.suppliers.map((supplier) => supplier.id);
        }

        product.expense_account = product.expense.id;
        product.income_account = product.income.id;
      }

      return product ? product : model.value;
    })();
  }

  if (!props.isEdit) {
    await generateItemCode();
  }
});

const onSubmit = async () => {
  await authenticatedApi(apiPath.value, Method.POST, model.value);
  await productStore.fetchAllProducts();
  showModal.value = false;
};
</script>
