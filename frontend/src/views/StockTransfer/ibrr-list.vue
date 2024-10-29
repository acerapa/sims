<template>
  <CustomTable
    :has-add-btn="true"
    :data="filteredData"
    :has-pagination="true"
    :row-prop-init="rowPropInit"
    @add-new-record="onAddNewRecord"
    :table-row-component="IbrrListRow"
    :table-header-component="ibrrListHeader"
  />
</template>

<script setup>
import { EventEnum } from "@/data/event";
import Event from "@/event";
import { computed, onMounted, ref } from "vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import ibrrListHeader from "@/components/stock-transfer/ibrr-list-header.vue";
import { useRouter } from "vue-router";
import { useTransferStore } from "@/stores/transfer";
import { TransferType } from "shared/enums/transfer";
import IbrrListRow from "@/components/stock-transfer/ibrr-list-row.vue";

const transferStore = useTransferStore();

const router = useRouter();
/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

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
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await transferStore.fetchByType(TransferType.IBRR);

  console.log(filteredData.value);
  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNewRecord = () => {
  router.push({
    name: "ibrr-form",
  });
};
</script>
