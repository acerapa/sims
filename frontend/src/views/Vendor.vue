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
      :data="filteredData"
      :has-pagination="true"
      v-model:is-edit="isEdit"
      v-model:show-modal="showModal"
      :row-prop-init="vendorRowEvent"
      v-model:search-text="searchText"
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
import { computed, onMounted, ref } from "vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import VendorModal from "@/components/Vendor/VendorModal.vue";
import VendorRow from "@/components/Vendor/VendorRow.vue";
import { useVendorStore } from "@/stores/supplier";
import CustomTable from "@/components/shared/CustomTable.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import Event from "@/event";
import VendorTableHeader from "@/components/Vendor/VendorTableHeader.vue";
import { EventEnum } from "@/data/event";

const vendorStore = useVendorStore();
const top = ref(0);
const showModal = ref(false);
const isEdit = ref(false);
const toDelete = ref();
const searchText = ref();
const selectedId = ref(-1);
const showRowMenu = ref(false);
const showDeleteConfirmModal = ref(false);

/** ================================================
 * EVENTS
 ** ================================================*/

// custom event
Event.on(EventEnum.GLOBAL_CLICK, function () {
  showRowMenu.value = false;
});

// define vendor row init props
const vendorRowEvent = "vendor-row-props-init";
Event.on(vendorRowEvent, function (data) {
  return {
    supplier: data,
  };
});

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return vendorStore.suppliers.filter((supplier) => {
    const searchCondition =
      `${supplier.id} ${supplier.company_name} ${supplier.first_name} ${supplier.last_name} ${supplier.annotation ? supplier.annotation : ""}`.toLowerCase();
    return searchText.value
      ? searchCondition.includes(searchText.value.toLowerCase())
      : supplier;
  });
});

/** ================================================
 * METHODS
 ** ================================================*/

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

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await vendorStore.fetchAllSuppliers();
  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
