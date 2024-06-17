<template>
  <ProductModal
    :is-edit="isEdit"
    v-model="showModal"
    v-if="showModal"
    :selected-id="toEdit"
    @new-product-category="onNewProductCategory"
    @new-supplier="onNewSupplier"
  />
  <ProductCategoryModal
    :is-edit="false"
    v-model="showCategoryModal"
    v-if="showCategoryModal"
  />
  <VendorModal
    :is-edit="false"
    v-model="showVendorModal"
    v-if="showVendorModal"
  />
  <DeleteConfirmModal
    v-if="showDeleteConfirmModal"
    v-model="showDeleteConfirmModal"
    href="products/delete"
    :data="toDelete"
    @after-delete="onAfterDelete"
  />
  <div class="table-wrapper w-full">
    <div class="flex justify-between items-center">
      <input type="search" class="input w-full max-w-72" placeholder="Search" />
      <button
        class="bg-primary p-2 rounded"
        @click="
          showModal = true;
          isEdit = false;
        "
      >
        <img src="../assets//icons/plus.svg" alt="Plus" />
      </button>
    </div>
    <hr class="bg-gray-50 -mx-4" />
    <div class="flex flex-col gap-7 overflow-x-auto pb-5">
      <!-- table header -->
      <div class="grid grid-cols-10 gap-3 min-w-[907px]">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="table-header">#</p>
        </div>
        <p class="col-span-1 table-header">Name</p>
        <p class="col-span-1 table-header">Item Code</p>
        <p class="col-span-3 table-header">Description</p>
        <p class="col-span-1 table-header">Stock</p>
        <p class="col-span-1 table-header">Added on</p>
        <p class="col-span-1 table-header">Status</p>
        <p class="col-span-1 table-header">Actions</p>
      </div>

      <!-- table body -->
      <div class="flex flex-col gap-4">
        <ProductRow
          v-for="(product, ndx) in productStore.products"
          :key="ndx"
          :product="product"
          @delete="onDeleteRow"
          @view="onViewRow"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ProductModal from "@/components/Product/ProductModal.vue";
import ProductRow from "@/components/Product/ProductRow.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import ProductCategoryModal from "@/components/Settings/ProductCategoryModal.vue";
import VendorModal from "@/components/Vendor/VendorModal.vue";

import { useProductStore } from "@/stores/product";
import { useVendorStore } from "@/stores/supplier";
import { useSettingsStore } from "@/stores/settings";

const showVendorModal = ref(false);
const showCategoryModal = ref(false);
const showDeleteConfirmModal = ref(false);
const showModal = ref(false);
const isEdit = ref(false);
const productStore = useProductStore();
const toDelete = ref({});
const toEdit = ref(0);

const supplierStore = useVendorStore();
const settingStore = useSettingsStore();

const onDeleteRow = (id) => {
  toDelete.value = { id };
  showDeleteConfirmModal.value = true;
};

const onViewRow = (id) => {
  toEdit.value = id;
  isEdit.value = true;
  showModal.value = true;
};

const onAfterDelete = async () => {
  showDeleteConfirmModal.value = false;
  toDelete.value = {};
  await productStore.fetchAllProducts();
};

const onNewProductCategory = () => {
  showModal.value = false;
  showCategoryModal.value = true;
};

const onNewSupplier = () => {
  showModal.value = false;
  showVendorModal.value = true;
}

onMounted(async () => {
  await productStore.fetchAllProducts();
  await supplierStore.fetchAllSuppliers();
  await settingStore.fetchAllProductCategories();
  await settingStore.fetchAllAccounts();
});
</script>
