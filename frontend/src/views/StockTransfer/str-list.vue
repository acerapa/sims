<template>
  <div>
    <CustomTable
      @add-new-record="onAddNewRecord"
      :table-header-component="StrListHeader"
    >
    </CustomTable>
  </div>
</template>

<script setup>
import StrListHeader from "@/components/stock-transfer/str-list-header.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import { EventEnum } from "@/data/event";
import Event from "@/event";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

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
onMounted(() => {
  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
