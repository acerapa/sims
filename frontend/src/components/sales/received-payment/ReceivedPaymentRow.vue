<template>
  <div class="grid grid-cols-9 gap-3">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.receivedPayment.id }}</p>
      <p class="col-span-1 text-sm">{{ props.receivedPayment.invoice_id }}</p>
      <p class="col-span-2 text-sm">Customer Name</p>
      <p class="col-span-2 text-sm">Employee Name</p>
      <p class="col-span-1 text-sm">{{ props.receivedPayment.date }}</p>
      <p class="col-span-1 text-sm">{{ props.receivedPayment.amount }}</p>
      <p class="col-span-1 text-sm">-</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  receivedPayment: {
    type: Object,
    required: false
  }
})
</script>
