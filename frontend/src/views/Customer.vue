<template>
  <div>Customers</div>
  <code
    >This is the list/records of the customers so far that buys the
    products</code
  >
</template>

<script setup>
import { EventEnum } from "@/data/event";
import Event from "@/event";

Event.emit(EventEnum.IS_PAGE_LOADING, false);
</script>
