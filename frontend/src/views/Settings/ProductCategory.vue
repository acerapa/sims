<template>
  <div>
    <ProductCategoryModal
      v-model="showModal"
      :is-edit="isEdit"
      v-if="showModal"
      :selected-id="selectedId"
    />
    <DeleteConfirmModal
      v-if="showDeleteConfirmationModal"
      v-model="showDeleteConfirmationModal"
      href="product-category/delete"
      :data="toDelete"
      @after-delete="afterDelete"
    />
    <CustomTable
      v-if="productCategories.length /* temporary for now need to add loaders */"
      :has-add-btn="true"
      :has-pagination="true"
      v-model:is-edit="isEdit"
      @open-menu="onSelectRow"
      :data="productCategories"
      v-model:show-modal="showModal"
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
</template>
<script setup>
import { onMounted, ref } from "vue";
import ProductCategoryModal from "@/components/Settings/ProductCategoryModal.vue";
import ProductCategoryRow from "@/components/Settings/ProductCategoryRow.vue";
import { useSettingsStore } from "@/stores/settings";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import ProductCategoryTableHeader from "@/components/Settings/ProductCategoryTableHeader.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import Event from "@/event";

const top = ref(0);
const showModal = ref(false);
const showRowMenu = ref(false);
const productCategories = ref([]);
const showDeleteConfirmationModal = ref(false);
const isEdit = ref(false);
const toDelete = ref({});
const toEdit = ref();
const selectedId = ref(-1);
const settingsStore = useSettingsStore();

// custom event
Event.on("global-click", function () {
  showRowMenu.value = false;
});

// define Product categories row props
const productCategoryRowEvent = "product-category-row-props-init";
Event.on(productCategoryRowEvent, function (item) {
  return { productCategory: item };
});

onMounted(async () => {
  productCategories.value = await settingsStore.fetchAllProductCategories();
});

const onSelectRow = (id) => {
  selectedId.value = id;
  top.value = event.target.offsetTop;
  showRowMenu.value = true;
};

const onDelete = () => {
  toDelete.value = { id: selectedId.value };
  showDeleteConfirmationModal.value = true;
};

const onView = () => {
  isEdit.value = true;
  showModal.value = true;
};

const afterDelete = async () => {
  await settingsStore.fetchAllProductCategories();
  showDeleteConfirmationModal.value = false;
};
</script>
