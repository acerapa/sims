<template>
  <div
    class="grid grid-cols-9 gap-3 min-w-[935px] gen-table-row"
    @click="emit('view', props.order.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.order.id }}</p>
    </div>
    <p class="col-span-2 text-sm">{{ props.order.type }}</p>
    <p class="col-span-1 text-sm">{{ parseFloat(total).toFixed(2) }}</p>
    <p class="col-span-2 text-sm">{{ props.order.purchase_date }}</p>
    <p class="col-span-2 text-sm">{{ props.order.bill_due }}</p>
    <p class="col-span-1 text-sm">{{ props.order.status }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['view'])

/** ================================================
 * COMPUTED
 ** ================================================*/
const total = computed(() => {
  return props.order.products.length
    ? props.order.products
        .map((p) => parseInt(p.SalesOrderProduct.total))
        .reduce((a, b) => a + b, 0)
    : 0
})
</script>
