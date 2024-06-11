<template>
  <div>
    <VendorModal
      v-if="showModal"
      v-model="showModal"
      :is-edit="isEdit"
      :selected-id="toEdit"
    />
    <DeleteConfirmModal
      v-model="showDeleteConfirmModal"
      v-if="showDeleteConfirmModal"
      :href="'suppliers/delete'"
      :data="toDelete"
      @after-delete="afterDelete"
    />
    <div class="table-wrapper w-full">
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
          <img src="../assets//icons/plus.svg" alt="Plus" />
        </button>
      </div>
      <hr class="bg-gray-50 -mx-4" />
      <div class="flex flex-col gap-7 overflow-x-auto pb-5">
        <div class="grid grid-cols-7 gap-3 items-center min-w-[564px]">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-3 table-header">Company Name</p>
          <p class="col-span-2 table-header">Rep. Name</p>
          <p class="col-span-1 table-header">Action</p>
        </div>
        <div class="flex flex-col gap-4 min-w-[564px]">
          <VendorRow
            v-for="(supplier, ndx) in vendorStore.suppliers"
            :supplier="supplier"
            :key="ndx"
            :current-open-menu="selectedMenuRow"
            @open-menu="onSelectRow"
            @view="onViewRow"
            @delete="onDeleteRow"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import VendorModal from "@/components/Vendor/VendorModal.vue";
import VendorRow from "@/components/Vendor/VendorRow.vue";
import { useVendorStore } from "@/stores/supplier";

const vendorStore = useVendorStore();

const showModal = ref(false);
const isEdit = ref(false);
const toEdit = ref(-1);
const toDelete = ref();
const selectedMenuRow = ref(-1);
const showDeleteConfirmModal = ref(false);

const onSelectRow = (id) => {
  selectedMenuRow.value = id;
};

const onViewRow = (id) => {
  toEdit.value = id;
  isEdit.value = true;
  showModal.value = true;
};

const onDeleteRow = async (id) => {
  toDelete.value = { id };
  showDeleteConfirmModal.value = true;
};

const afterDelete = async () => {
  await vendorStore.fetchAllSuppliers();
  showDeleteConfirmModal.value = false;
}

onMounted(async () => {
  await vendorStore.fetchAllSuppliers();
});
</script>
