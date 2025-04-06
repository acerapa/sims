<template>
  <div class="grid grid-cols-7 items-center gen-table-row">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm"># {{ props.delivery.id }}</p>
    </div>

    <p class="col-span-1 text-sm"># {{ props.delivery.sales_order_id }}</p>
    <p class="col-span-2 text-sm">
      {{
        new Date(props.delivery.delivery_date).toLocaleString('default', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      }}
    </p>
    <p class="col-span-2 text-sm">{{ props.delivery.courier }}</p>
    <div class="col-span-1">
      <BadgeComponent
        :text="DeliveryStatusMap[props.delivery.status].text"
        :custom-class="DeliveryStatusMap[props.delivery.status].class"
      />
    </div>
  </div>
</template>

<script setup>
import { DeliveryStatusMap } from 'shared'
import BadgeComponent from '../shared/BadgeComponent.vue'

const props = defineProps({
  delivery: {
    type: Object,
    default: () => ({})
  }
})
</script>
