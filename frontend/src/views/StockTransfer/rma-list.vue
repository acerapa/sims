<template>
  <div>
    <CustomTable
      title="RMA list"
      :data="filterData"
      :has-pagination="true"
      @open-menu="onSelectRow"
      :row-prop-init="rowInitProp"
      @add-new-record="onNewRecord"
      :table-row-component="RmaListRow"
      :table-header-component="RmaListHeader"
    >
      <RowMenu v-if="showRowMenu" :top="top" />
    </CustomTable>
  </div>
</template>

<script setup>
import RowMenu from "@/components/shared/RowMenu.vue";
import RmaListHeader from "@/components/stock-transfer/rma-list-header.vue";
import RmaListRow from "@/components/stock-transfer/rma-list-row.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useTransferStore } from "@/stores/transfer";
import Event from "@/event";
import { EventEnum } from "@/data/event";

const top = ref(0);
const router = useRouter();
const selectedId = ref(null);
const showRowMenu = ref(false);
const transferStore = useTransferStore();

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

Event.on(EventEnum.GLOBAL_CLICK, function () {
  showRowMenu.value = false;
});

const rowInitProp = "rma-row-init-prop";
Event.on(rowInitProp, (data) => {
  return {
    rma: data,
  };
});

/** ================================================
 * COMPUTED
 ** ================================================*/
const filterData = computed(() => {
  return transferStore.rmas;
});

/** ================================================
 * METHODS
 ** ================================================*/
const onNewRecord = () => {
  router.push({
    name: "rma-form",
  });
};

const onSelectRow = (id) => {
  top.value = event.target.offsetTop;
  selectedId.value = id;
  showRowMenu.value = true;
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await transferStore.fetchTransfers();

  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
