<template>
  <div
    class="grid gap-3 min-w-[1132px] pb-2 border-b"
    :class="[props.isDisabled ? 'grid-cols-11' : 'grid-cols-12']"
  >
    <div class="col-span-3 flex gap-3 items-center">
      <input type="checkbox" class="input" v-if="!props.isDisabled" />
      <p class="table-header pl-3">Item</p>
    </div>
    <p class="col-span-2 table-header pl-3">Serial number</p>
    <p class="col-span-3 table-header pl-3">Problem</p>
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
