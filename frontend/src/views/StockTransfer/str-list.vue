<template>
  <div>
    <h1>Stock Transfer Report Form</h1>
  </div>
</template>

<script setup>
import { EventEnum } from "@/data/event";
import Event from "@/event";
import { onMounted } from "vue";

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
</script>
