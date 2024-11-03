<template>
  <div>
    <CustomTable
      :data="[]"
      title="RMA list"
      :row-prop-init="'test'"
      :has-pagination="true"
      @add-new-record="onNewRecord"
      :table-row-component="RmaListHeader"
    />
  </div>
</template>

<script setup>
import RmaListHeader from "@/components/stock-transfer/rma-list-header.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const onNewRecord = () => {
  router.push({
    name: "rma-form",
  });
};
</script>
