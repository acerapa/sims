<template>
  <div>
    <ProductCategoryModal
      v-model="showModal"
      :is-edit="isEdit"
      v-if="showModal"
      :selected-id="selectedId"
    />
    <ProductPointModal
      v-model="reorderingModalShow"
      v-if="reorderingModalShow"
      :is-edit="isEdit"
      :selected-id="selectedReorderingId"
    />
    <DeleteConfirmModal
      v-if="showDeleteConfirmationModal"
      v-model="showDeleteConfirmationModal"
      :href="deleteHref"
      :data="toDelete"
      @after-delete="afterDelete"
    />
    <div class="flex flex-col gap-6">
      <CustomTable
        :has-pagination="true"
        title="Product Reordering Point"
        @open-menu="onSelectReorderingRow"
        v-model:show-modal="reorderingModalShow"
        :row-prop-init="productReorderingRowEvent"
        :data="settingsStore.productReorderingPoints"
        :table-row-component="ProductReorderingPointRow"
        :table-header-component="ProductReorderingPointTableHeader"
      >
        <RowMenu
          :top="top"
          v-if="showReorderingRowMenu"
          class="right-[100px]"
          @view="onViewReordering"
          @delete="onDeleteReordering"
        />
      </CustomTable>
      <CustomTable
        :has-add-btn="true"
        :has-pagination="true"
        v-model:is-edit="isEdit"
        @open-menu="onSelectRow"
        title="Product Categories"
        v-model:show-modal="showModal"
        :data="settingsStore.productCategories"
        :row-prop-init="productCategoryRowEvent"
        :table-row-component="ProductCategoryRow"
        :table-header-component="ProductCategoryTableHeader"
      >
        <RowMenu
          :top="top"
          v-if="showRowMenu"
          class="right-[100px]"
          @view="onView"
          @delete="onDelete"
        />
      </CustomTable>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import ProductPointModal from "@/components/Settings/ProductPointModal.vue";
import ProductCategoryModal from "@/components/Settings/ProductCategoryModal.vue";
import ProductCategoryRow from "@/components/Settings/ProductCategoryRow.vue";
import { useSettingsStore } from "@/stores/settings";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import ProductReorderingPointRow from "@/components/Settings/ProductReorderingPointRow.vue";
import ProductCategoryTableHeader from "@/components/Settings/ProductCategoryTableHeader.vue";
import ProductReorderingPointTableHeader from "@/components/Settings/ProductReorderingPointTableHeader.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import Event from "@/event";
import { EventEnum } from "@/data/event";

const top = ref(0);
const toDelete = ref({});
const isEdit = ref(false);
const selectedId = ref(-1);
const deleteHref = ref("");
const showModal = ref(false);
const showRowMenu = ref(false);
const selectedReorderingId = ref(-1);
const reorderingModalShow = ref(false);
const showReorderingRowMenu = ref(false);
const settingsStore = useSettingsStore();
const showDeleteConfirmationModal = ref(false);

/** ================================================
 * EVENTS
 ** ================================================*/

// custom event
Event.on("global-click", function () {
  showRowMenu.value = false;
  showReorderingRowMenu.value = false;
});

// define Product categories row props
const productCategoryRowEvent = "product-category-row-props-init";
Event.on(productCategoryRowEvent, function (item) {
  return { productCategory: item };
});

// define Product reordering point row props
const productReorderingRowEvent = "product-reordering-row-props-init";
Event.on(productReorderingRowEvent, function (item) {
  return { productReordering: item };
});

/** ================================================
 * METHODS
 ** ================================================*/

const onSelectRow = (id) => {
  selectedId.value = id;
  top.value = event.target.offsetTop;
  showRowMenu.value = true;
};

const onSelectReorderingRow = (id) => {
  selectedReorderingId.value = id;
  top.value = event.target.offsetTop;
  showReorderingRowMenu.value = true;
};

const onDelete = () => {
  toDelete.value = { id: selectedId.value };
  deleteHref.value = "product-category/delete";
  showDeleteConfirmationModal.value = true;
};

const onDeleteReordering = () => {
  toDelete.value = { id: selectedReorderingId.value };
  deleteHref.value = "product-setting/delete";
  showDeleteConfirmationModal.value = true;
};

const onView = () => {
  isEdit.value = true;
  showModal.value = true;
};

const onViewReordering = () => {
  isEdit.value = true;
  reorderingModalShow.value = true;
};

const afterDelete = async () => {
  await settingsStore.fetchAllProductCategories();
  await settingsStore.fetchAllProductReorderingPoints();
  showDeleteConfirmationModal.value = false;
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await settingsStore.fetchAllProductCategories();
  await settingsStore.fetchAllProductReorderingPoints();
  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
