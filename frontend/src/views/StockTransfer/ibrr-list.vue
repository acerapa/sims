<template>
  <DeleteConfirmModal
    :href="`transfer/${selectedId}`"
    v-if="showDeleteModal"
    v-model="showDeleteModal"
  />
  <CustomTable
    :has-add-btn="true"
    :data="filteredData"
    :has-pagination="true"
    @open-menu="onSelectRow"
    :row-prop-init="rowPropInit"
    @add-new-record="onAddNewRecord"
    :table-row-component="IbrrListRow"
    :table-header-component="ibrrListHeader"
  >
    <RowMenu :top="top" v-if="showRowMenu" @view="onView" @delete="onDelete" />
  </CustomTable>
</template>

<script setup>
import { EventEnum } from "@/data/event";
import Event from "@/event";
import { computed, onMounted, ref } from "vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import ibrrListHeader from "@/components/stock-transfer/ibrr-list-header.vue";
import { useRouter } from "vue-router";
import { useTransferStore } from "@/stores/transfer";
import { TransferType } from "shared/enums";
import IbrrListRow from "@/components/stock-transfer/ibrr-list-row.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

const top = ref(0);
const router = useRouter();
const selectedId = ref(null);
const showRowMenu = ref(false);
const showDeleteModal = ref(false);
const transferStore = useTransferStore();
/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

Event.on(EventEnum.GLOBAL_CLICK, function () {
  showRowMenu.value = false;
});

const rowPropInit = "ibrr-row-prop-init";
Event.on(rowPropInit, (data) => {
  return {
    ibrr: data,
  };
});

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return transferStore.ibrrs;
});

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNewRecord = () => {
  router.push({
    name: "ibrr-form",
  });
};

const onSelectRow = (id) => {
  top.value = event.target.offsetTop;
  showRowMenu.value = true;
  selectedId.value = id;
};

const onView = () => {
  router.push({
    name: "ibrr-form",
    query: { id: selectedId.value },
  });
};

const onDelete = async () => {
  showDeleteModal.value = true;
};
/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await transferStore.fetchTransfers();

  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
