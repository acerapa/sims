<template>
  <div
    class="grid gap-3 min-w-[1033px] pb-2 border-b"
    :class="[props.isDisabled ? 'grid-cols-8' : 'grid-cols-9']"
  >
    <div class="col-span-5 flex gap-3 items-center">
      <input type="checkbox" class="input" v-if="!props.isDisabled" />
      <p class="table-header pl-3">Item Description</p>
    </div>
    <p class="col-span-1 table-header pl-3">Qty</p>
    <p class="col-span-1 table-header pl-3">Cost</p>
    <p class="col-span-1 table-header pl-3">Amount</p>
    <p class="col-span-1 table-header pl-3" v-if="!props.isDisabled">Action</p>
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
