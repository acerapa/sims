<template>
  <div class="grid grid-cols-12 gap-3">
    <p class="text-sm col-span-3 pl-3">{{ props.sale.name }}</p>
    <p class="text-sm col-span-2">
      {{ DateHelpers.formatDate(props.sale.date, 'YYYY/MM/DD') }}
    </p>
    <p class="text-sm col-span-1">{{ props.sale.id }}</p>
    <p class="text-sm col-span-2">{{ props.sale.customer_name }}</p>
    <p class="text-sm col-span-1">{{ props.sale.quantity }}</p>
    <p class="text-sm col-span-1">{{ props.sale.sale_price }}</p>
    <p class="text-sm col-span-1">{{ props.sale.amount }}</p>
    <p class="text-sm col-span-1">{{ props.sale.balance }}</p>
  </div>
</template>

<script setup>
import { DateHelpers } from 'shared/helpers'

const props = defineProps({
  sale: {
    type: Object,
    default: () => ({})
  }
})
</script>
