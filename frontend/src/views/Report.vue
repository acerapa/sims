<template>
  <div>Reports is coming soon!</div>
  <code>
    This page will contains the list of the reports clasified among inventorty
    and sales
  </code>
</template>

<script setup>
import { EventEnum } from '@/data/event';
import Event from '@/event';
import { onMounted } from 'vue';

Event.emit(EventEnum.IS_PAGE_LOADING, true);

onMounted(() => {
  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
