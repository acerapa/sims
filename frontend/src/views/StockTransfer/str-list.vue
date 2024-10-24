<template>
  <div>
    <CustomTable
      :data="filteredData"
      @add-new-record="onAddNewRecord"
      :row-prop-init="rowPropInit"
      :table-row-component="StrListRow"
      :table-header-component="StrListHeader"
    >
    </CustomTable>
  </div>
</template>

<script setup>
import StrListRow from "@/components/stock-transfer/str-list-row.vue";
import StrListHeader from "@/components/stock-transfer/str-list-header.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import { EventEnum } from "@/data/event";
import Event from "@/event";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTransferStore } from "@/stores/transfer";
import { TransferType } from "shared/enums/transfer";

const router = useRouter();
const transferStore = useTransferStore();

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

const rowPropInit = "str-row-prop-init";
Event.on(rowPropInit, function (data) {
  return { str: data };
});
/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return transferStore.strs.filter((str) => true);
});

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNewRecord = () => {
  router.push({
    name: "str-form",
  });
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await transferStore.fetchByType(TransferType.STR);
  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
