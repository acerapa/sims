<template>
  <div>
    <ProductCategoryModal v-model="showModal" v-if="showModal" />
    <DeleteConfirmModal
      v-if="showDeleteConfirmationModal"
      v-model="showDeleteConfirmationModal"
      href="product-category/delete"
      :data="toDelete"
      @after-delete="afterDelete"
    />
    <div class="table-wrapper bg-white w-full flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <input
          type="search"
          class="input w-full max-w-72"
          placeholder="Search"
        />
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
      <hr class="bg-gray-50 -mx-4" />
      <div class="flex flex-col gap-7 overflow-x-auto pb-5">
        <!-- table headers -->
        <div class="grid gap-3 grid-cols-7">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-3 table-header">Name</p>
          <p class="col-span-2 table-header">Date Added</p>
          <p class="col-span-1 table-header">Action</p>
        </div>

        <!-- Datas -->
        <div class="flex flex-col gap-4">
          <ProductCategoryRow
            v-for="(productCategory, ndx) in settingsStore.productCategories"
            :product-category="productCategory"
            :key="ndx"
            @open-menu="onSelectRow"
            :current-open-menu="selectedMenuRow"
            @delete="onDelete"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import ProductCategoryModal from "@/components/Settings/ProductCategoryModal.vue";
import ProductCategoryRow from "@/components/Settings/ProductCategoryRow.vue";
import { useSettingsStore } from "@/stores/settings";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

const showModal = ref(false);
const showDeleteConfirmationModal = ref(false);
const isEdit = ref(false);
const toDelete = ref({});
const selectedMenuRow = ref(-1);
const settingsStore = useSettingsStore();

onMounted(async () => {
  await settingsStore.fetchAllProductCategories();
});

const onSelectRow = (data) => {
  selectedMenuRow.value = data;
};

const onDelete = (id) => {
  toDelete.value = { id };
  showDeleteConfirmationModal.value = true;
};

const afterDelete = async () => {
  await settingsStore.fetchAllProductCategories();
  showDeleteConfirmationModal.value = false;
};
</script>
