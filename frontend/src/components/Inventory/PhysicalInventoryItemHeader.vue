<template>
  <div class="grid grid-cols-11 gap-3 min-w-[1032px]">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" v-if="props.hasCheckBox" />
      <p class="table-header">#</p>
    </div>
    <p class="col-span-2 table-header">Name</p>
    <p class="col-span-2 table-header">Item Desc</p>
    <p class="col-span-1 table-header">Qty</p>
    <p class="col-span-1 table-header">Status</p>
    <p class="col-span-1 table-header">Phys Count</p>
    <p class="col-span-2 table-header">Remarks</p>
    <p class="col-span-1 table-header">Actions</p>
  </div>
</template>

<script setup>
const props = defineProps({
  hasCheckBox: {
    type: Boolean,
  },
});
</script>
