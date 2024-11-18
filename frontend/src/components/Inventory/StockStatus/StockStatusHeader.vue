<template>
  <div class="grid grid-cols-10 gap-3 pl-20">
    <p class="col-span-4 table-header">Item Description</p>
    <p class="col-span-1 table-header">On Hand</p>
    <p class="col-span-1 table-header">On Sale</p>
    <p class="col-span-1 table-header">Available</p>
    <p class="col-span-1 table-header">Ordered</p>
    <p class="col-span-1 table-header">On PO</p>
    <p class="col-span-1 table-header">Next Deli</p>
  </div>
</template>

<script setup>
const props = defineProps({
  hasCheckBox: {
    type: Boolean,
    default: true
  }
})
</script>
