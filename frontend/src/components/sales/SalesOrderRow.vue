<template>
  <div
    class="grid grid-cols-10 items-center gap-3 min-w-[935px] gen-table-row"
    @click="emit('view', props.order.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.order.id }}</p>
    </div>
    <div class="col-span-1">
      <BadgeComponent
        :text="SalesOrderTypeMap[props.order.type].text"
        :custom-class="SalesOrderTypeMap[props.order.type].class"
      />
    </div>
    <p class="col-span-2 text-sm">{{ customerName }}</p>
    <p class="col-span-2 text-sm">{{ salesPersonName }}</p>
    <p class="col-span-1 text-sm">
      {{
        new Date(props.order.purchase_date).toLocaleString('default', {
          month: 'numeric',
          day: '2-digit',
          year: 'numeric'
        })
      }}
    </p>
    <p class="col-span-1 text-sm">{{ props.order.payment_method.name }}</p>
    <p class="col-span-1 text-sm">{{ parseFloat(total).toFixed(2) }}</p>
    <div class="col-span-1">
      <BadgeComponent
        :text="SalesOrderStatusMap[props.order.status].text"
        :custom-class="SalesOrderStatusMap[props.order.status].class"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BadgeComponent from '../shared/BadgeComponent.vue'
import { SalesOrderStatusMap, SalesOrderTypeMap } from 'shared'

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

const customerName = computed(() => {
  const { first_name, last_name } = props.order.customer
  return `${first_name} ${last_name}`
})

const salesPersonName = computed(() => {
  const { first_name, last_name } = props.order.sales_person
  return `${first_name} ${last_name}`
})
</script>
