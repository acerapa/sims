<template>
  <div class="grid grid-cols-7 gap-3 gen-table-row">
    <p class="col-span-7 text-sm font-bold">
      {{ props.po.supplier.company_name }}
    </p>
    <div class="col-span-7">
      <div class="grid grid-cols-7 gap-3 group" v-for="po in props.po.pos">
        <p class="col-span-2" />
        <p class="col-span-1 text-sm"># {{ po.id }}</p>
        <p class="col-span-2 text-sm">
          {{
            new Date(po.received_date).toLocaleString('default', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            })
          }}
        </p>
        <p class="col-span-1 text-sm">
          {{ po.delivery_number }}
        </p>
        <p
          class="col-span-1 text-sm text-end group-last:border-b group-last:border-black"
        >
          ₱ {{ parseFloat(po.amount).toFixed(2) }}
        </p>
      </div>
    </div>
    <div class="col-span-7 grid grid-cols-7">
      <p class="text-sm font-bold col-span-6">
        Total {{ props.po.supplier.company_name }}
      </p>
      <p class="text-sm font-bold col-span-1 text-end">
        ₱ {{ totalPurchase.toFixed(2) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  po: {
    type: Object,
    default: () => ({})
  }
})

const totalPurchase = computed(() => {
  return props.po.pos
    .map((p) => parseFloat(p.amount))
    .reduce((a, b) => a + b, 0)
})
</script>
