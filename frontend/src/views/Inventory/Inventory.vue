<template>
  <div>Inventory</div>
  <code>Need to confirm what should be in this page</code>
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
