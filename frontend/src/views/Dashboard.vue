<template>
  <div>
    <h1>Your all set 🎉!</h1>
  </div>
</template>

<script setup>
import Event from "@/event";
import { EventEnum } from "@/data/event";

// sample implemetation
Event.emit(EventEnum.IS_PAGE_LOADING, true);

setTimeout(() => Event.emit(EventEnum.IS_PAGE_LOADING, false), 1000);
</script>
