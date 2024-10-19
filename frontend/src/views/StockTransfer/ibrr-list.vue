<template>
  <CustomTable
    :table-header-component="ibrrListHeader"
    :has-add-btn="true"
    @add-new-record="onAddNewRecord"
  />
</template>

<script setup>
import { EventEnum } from "@/data/event";
import Event from "@/event";
import { onMounted, ref } from "vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import ibrrListHeader from "@/components/stock-transfer/ibrr-list-header.vue";
import { useRouter } from "vue-router";

const router = useRouter();
/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(() => {
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
