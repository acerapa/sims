<template>
  <div
    class="grid gap-3 min-w-[864px]"
    :class="props.isDisabled ? 'grid-cols-11' : 'grid-cols-12'"
  >
    <p class="table-header col-span-5 pl-3">Item Description</p>
    <p class="table-header col-span-2 pl-3">Serial No.</p>
    <p class="table-header col-span-1 pl-3">Qty</p>
    <p class="table-header col-span-1 pl-3">Discount</p>
    <p class="table-header col-span-1 pl-3">Price</p>
    <p class="table-header col-span-1 pl-3">Amount</p>
    <p v-if="!props.isDisabled" class="table-header col-span-1 pl-3">Action</p>
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
