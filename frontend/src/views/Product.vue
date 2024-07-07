<template>
  <ProductModal
    :is-edit="isEdit"
    v-model="showModal"
    v-if="showModal"
    :selected-id="selectedId"
  />
  <DeleteConfirmModal
    v-if="showDeleteConfirmModal"
    v-model="showDeleteConfirmModal"
    href="products/delete"
    :data="toDelete"
    @after-delete="onAfterDelete"
  />
  <CustomTable
    :has-add-btn="true"
    :has-pagination="true"
    v-model:show-modal="showModal"
    v-model:is-edit="isEdit"
  >
    <template v-slot:table_header>
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
    </template>
    <template v-slot:table_body>
      <div class="flex flex-col gap-4">
        <ProductRow
          v-for="(product, ndx) in productStore.products"
          :key="ndx"
          :product="product"
          @open-menu="onSelectRow"
        />
      </div>
    </template>
    <RowMenu
      :top="top"
      v-if="showRowMenu"
      @view="onViewRow"
      @delete="onDeleteRow"
    />
  </CustomTable>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ProductModal from "@/components/Product/ProductModal.vue";
import ProductRow from "@/components/Product/ProductRow.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import { useProductStore } from "@/stores/product";
import Event from "@/event";

const top = ref(0);
const showRowMenu = ref(false);
const showDeleteConfirmModal = ref(false);
const showModal = ref(false);
const isEdit = ref(false);
const productStore = useProductStore();
const toDelete = ref({});
const selectedId = ref(0);

// custom event
Event.on("global-click", function () {
  showRowMenu.value = false;
});

const onSelectRow = (id) => {
  top.value = event.target.offsetTop;
  showRowMenu.value = true;
  selectedId.value = id;
};

const onDeleteRow = () => {
  toDelete.value = { id: selectedId.value };
  showDeleteConfirmModal.value = true;
};

const onViewRow = () => {
  isEdit.value = true;
  showModal.value = true;
};

const onAfterDelete = async () => {
  showDeleteConfirmModal.value = false;
  toDelete.value = {};
  await productStore.fetchAllProducts();
};

onMounted(async () => {
  await productStore.fetchAllProducts();
});
</script>
