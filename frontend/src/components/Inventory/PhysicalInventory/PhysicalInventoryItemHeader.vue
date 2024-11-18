<template>
  <div class="grid grid-cols-10 gap-3 pl-10">
    <div class="col-span-2 flex gap-3 items-center">
      <input type="checkbox" class="input" v-if="props.hasCheckBox" />
      <p class="table-header">#</p>
    </div>
    <p class="col-span-4 table-header">Item Description</p>
    <p class="col-span-2 table-header">On hand</p>
    <p class="col-span-2 table-header">Physical Count</p>
  </div>
</template>

<script setup>
const props = defineProps({
  hasCheckBox: {
    type: Boolean
  }
})
</script>
