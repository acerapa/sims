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
    :has-filter="true"
    :has-add-btn="true"
    :data="filteredData"
    :has-pagination="true"
    v-model:is-edit="isEdit"
    v-model:show-modal="showModal"
    v-model:search-text="searchText"
    :row-prop-init="productRowEvent"
    :table-row-component="ProductRow"
    :table-header-component="ProductTableHeader"
    @open-menu="onSelectRow"
  >
    <!-- filter contents -->
    <template v-slot:filters>
      <div class="flex flex-col gap-3 mt-3">
        <CustomInput
          type="select"
          name="Category"
          :has-label="true"
          label="Select Category"
          v-model="filters.category"
          :options="categoryOptions"
          placeholder="Select Category"
          @reset="filters.category = null"
        />
        <div>
          <small>Added on</small>
          <div class="flex gap-3">
            <CustomInput
              type="date"
              name="date_from"
              placeholder="From"
              v-model="filters.added_on_from"
              @reset="filters.added_on_from = ''"
              input-class="min-w-[200px] max-h-[38px]"
            />
            <CustomInput
              type="date"
              name="date_to"
              placeholder="To"
              v-model="filters.added_on_to"
              @reset="filters.added_on_to = ''"
              input-class="min-w-[200px] max-h-[38px]"
            />
          </div>
        </div>
        <div>
          <small>Stocks</small>
          <div class="flex gap-3">
            <CustomInput
              name="from"
              label="From"
              type="number"
              :has-label="true"
              placeholder="From"
              v-model="filters.stock_from"
              @reset="filters.stock_from = null"
            />
            <CustomInput
              name="to"
              label="From"
              type="number"
              :has-label="true"
              placeholder="To"
              v-model="filters.stock_to"
              @reset="filters.stock_to = null"
            />
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
import { computed, onMounted, ref } from "vue";
import ProductModal from "@/components/Product/ProductModal.vue";
import ProductRow from "@/components/Product/ProductRow.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import CustomInput from "@/components/shared/CustomInput.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import { useProductStore } from "@/stores/product";
import Event from "@/event";
import { EventEnum } from "@/data/event";
import ProductTableHeader from "@/components/Product/ProductTableHeader.vue";
import { DateHelpers } from "shared/helpers";
import { useSettingsStore } from "@/stores/settings";

const top = ref(0);
const toDelete = ref({});
const isEdit = ref(false);
const selectedId = ref(0);
const searchText = ref("");
const showModal = ref(false);
const showRowMenu = ref(false);
const categoryOptions = ref([]);
const productStore = useProductStore();
const settingStore = useSettingsStore();
const showDeleteConfirmModal = ref(false);
const filters = ref({
  added_on_from: "",
  added_on_to: "",
  stock_from: null,
  stock_to: null,
  category: "",
});

/** ================================================
 * EVENTS
 ** ================================================*/

Event.emit(EventEnum.IS_PAGE_LOADING, true);

// custom event
Event.on(EventEnum.GLOBAL_CLICK, function () {
  showRowMenu.value = false;
});

// define product row props
const productRowEvent = "product-row-init-props";
Event.on(productRowEvent, function (data) {
  return { product: data };
});

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return productStore.products
    .filter((product) => {
      const catId =
        filters.value.category === "" ? null : filters.value.category;

      return catId ? product.category_id == catId : product;
    })
    .filter((product) => {
      filters.value.stock_from =
        filters.value.stock_from === "" ? null : filters.value.stock_from;

      filters.value.stock_to =
        filters.value.stock_to === "" ? null : filters.value.stock_to;

      if (
        filters.value.stock_from !== null &&
        filters.value.stock_to !== null
      ) {
        return (
          product.quantity_in_stock >= filters.value.stock_from &&
          product.quantity_in_stock <= filters.value.stock_to
        );
      } else if (
        filters.value.stock_from !== null &&
        filters.value.stock_to == null
      ) {
        return product.quantity_in_stock >= filters.value.stock_from;
      } else if (
        filters.value.stock_from == null &&
        filters.value.stock_to !== null
      ) {
        return product.quantity_in_stock <= filters.value.stock_to;
      } else {
        return product;
      }
    })
    .filter((product) =>
      DateHelpers.getRangeDates(
        filters.value.added_on_from,
        filters.value.added_on_to,
        product.createdAt
      )
    )
    .filter((product) => {
      const searchCondition =
        `${product.id} ${product.name} ${product.item_code} ${product.purchase_description} ${product.quantity_in_stock} ${DateHelpers.formatDate(product.createdAt, "M/D/YYYY")}`.toLowerCase();
      return searchText.value
        ? searchCondition.includes(searchText.value.toLowerCase())
        : product;
    });
});

/** ================================================
 * METHODS
 ** ================================================*/

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

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await productStore.fetchAllProducts();
  categoryOptions.value = await settingStore.categoryOption();
  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
