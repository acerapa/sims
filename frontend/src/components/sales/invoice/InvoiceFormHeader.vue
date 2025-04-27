<template>
  <div
    class="grid gap-3 min-w-[1295px]"
    :class="props.isDisabled ? 'grid-cols-12' : 'grid-cols-13'"
  >
    <p class="table-header col-span-5 pl-3">Item Description</p>
    <p class="table-header col-span-3 pl-3">Serial Number</p>
    <p class="table-header col-span-1 pl-3">Qty</p>
    <p class="table-header col-span-1 pl-3">Price</p>
    <p class="table-header col-span-1 pl-3">Discount</p>
    <p class="table-header col-span-1 pl-3">Total</p>
    <p class="table-header col-span-1 pl-3" v-if="!props.isDisabled">Action</p>
  </div>
</template>

<script setup>
const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false
  }
})
</script>
