<template>
  <div>
    <VendorModal
      v-if="showModal"
      v-model="showModal"
      :is-edit="isEdit"
      :selected-id="selectedId"
    />
    <DeleteConfirmModal
      v-model="showDeleteConfirmModal"
      v-if="showDeleteConfirmModal"
      :href="'suppliers/delete'"
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
        <div class="grid grid-cols-7 gap-3 items-center min-w-[564px]">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-3 table-header">Company Name</p>
          <p class="col-span-2 table-header">Rep. Name</p>
          <p class="col-span-1 table-header">Action</p>
        </div>
      </template>
      <template v-slot:table_body>
        <div class="flex flex-col gap-4 min-w-[564px]">
          <VendorRow
            v-for="(supplier, ndx) in vendorStore.suppliers"
            :supplier="supplier"
            :key="ndx"
            @open-menu="onSelectRow"
          />
        </div>
      </template>
      <RowMenu
        :top="top"
        v-if="showRowMenu"
        @view="onViewRow"
        @delete="onDeleteRow"
        class="right-24"
      />
    </CustomTable>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import VendorModal from "@/components/Vendor/VendorModal.vue";
import VendorRow from "@/components/Vendor/VendorRow.vue";
import { useVendorStore } from "@/stores/supplier";
import CustomTable from "@/components/shared/CustomTable.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import Event from "@/event";

const vendorStore = useVendorStore();

const top = ref(0);
const showModal = ref(false);
const isEdit = ref(false);
const toDelete = ref();
const selectedId = ref(-1);
const showRowMenu = ref(false);
const showDeleteConfirmModal = ref(false);

// custom event
Event.on("global-click", function () {
  showRowMenu.value = false;
});

const onSelectRow = (id) => {
  selectedId.value = id;
  top.value = event.target.offsetTop;
  showRowMenu.value = true;
};

const onViewRow = () => {
  isEdit.value = true;
  showModal.value = true;
};

const onDeleteRow = async () => {
  toDelete.value = { id: selectedId.value };
  showDeleteConfirmModal.value = true;
};

const afterDelete = async () => {
  await vendorStore.fetchAllSuppliers();
  showDeleteConfirmModal.value = false;
};

onMounted(async () => {
  await vendorStore.fetchAllSuppliers();
});
</script>
