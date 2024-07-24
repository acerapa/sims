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
      :has-add-btn="true"
      :has-pagination="true"
      v-model:show-modal="showModal"
      v-model:is-edit="isEdit"
    >
      <template v-slot:table_header>
        <div class="grid gap-3 grid-cols-7">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-3 table-header">Name</p>
          <p class="col-span-2 table-header">Date Added</p>
          <p class="col-span-1 table-header">Action</p>
        </div>
      </template>
      <template v-slot:table_body>
        <div class="flex flex-col gap-4">
          <ProductCategoryRow
            v-for="(productCategory, ndx) in settingsStore.productCategories"
            :product-category="productCategory"
            :key="ndx"
            @open-menu="onSelectRow"
          />
        </div>
      </template>
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
import RowMenu from "@/components/shared/RowMenu.vue";
import Event from "@/event";

const top = ref(0);
const showModal = ref(false);
const showRowMenu = ref(false);
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

onMounted(async () => {
  await settingsStore.fetchAllProductCategories();
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
