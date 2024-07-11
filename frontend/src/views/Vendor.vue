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
      v-if="vendorStore.suppliers.length"
      :has-add-btn="true"
      :has-pagination="true"
      v-model:is-edit="isEdit"
      :data="vendorStore.suppliers"
      v-model:show-modal="showModal"
      :row-prop-init="vendorRowEvent"
      :table-row-component="VendorRow"
      :table-header-component="VendorTableHeader"
      @open-menu="onSelectRow"
    >
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
import VendorTableHeader from "@/components/Vendor/VendorTableHeader.vue";

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

// define vendor row init props
const vendorRowEvent = "vendor-row-props-init";
Event.on(vendorRowEvent, function (data) {
  return {
    supplier: data,
  };
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
