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
    v-model:is-edit="isEdit"
    :key="productStore.products"
    :data="productStore.products"
    v-model:show-modal="showModal"
    :row-prop-init="productRowEvent"
    :table-row-component="ProductRow"
    :table-header-component="ProductTableHeader"
    @open-menu="onSelectRow"
  >
    <!-- filter contents -->
    <template v-slot:filters>
      <div class="flex flex-col gap-3 mt-3">
        <div>
          <small>Dates</small>
          <div class="flex gap-3">
            <input
              type="text"
              class="input date min-w-[200px] max-h-[38px]"
              placeholder="From"
              @focus="$event.target.type = 'date'"
              @blur="$event.target.type = 'text'"
            />
            <input
              type="text"
              class="input date min-w-[200px] max-h-[38px]"
              placeholder="To"
              @focus="$event.target.type = 'date'"
              @blur="$event.target.type = 'text'"
            />
          </div>
        </div>
        <div>
          <small>Stocks</small>
          <div class="flex gap-3">
            <select name="operations" id="operations" class="input w-full">
              <option value="1">Equals (=)</option>
              <option value="1">Less than (&lt;)</option>
              <option value="1">Greater than (&gt;)</option>
            </select>
            <input type="number" class="input" placeholder="Stocks" />
          </div>
        </div>
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
import ProductTableHeader from "@/components/Product/ProductTableHeader.vue";

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

// define product row props
const productRowEvent = "product-row-init-props";
Event.on(productRowEvent, function (data) {
  return { product: data };
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
