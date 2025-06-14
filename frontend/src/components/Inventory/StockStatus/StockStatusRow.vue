<template>
  <div class="grid grid-cols-12 gap-3 min-w-[1160px]">
    <p
      :style="{ paddingLeft: `${props.paddingLeft}rem` }"
      class="font-bold col-span-12"
    >
      {{ props.category.name }}
    </p>
    <div
      class="col-span-12 grid grid-cols-12 gap-3 hover:bg-gray-50"
      v-for="p in props.category.products"
      :key="p.id"
    >
      <p
        :style="{ paddingLeft: `${props.paddingLeft + 1}rem` }"
        class="font-medium col-span-5"
      >
        {{ p.product_details.purchase_description }}
      </p>
      <p class="col-span-2">{{ p.suppliers[0].company_name }}</p>
      <p class="col-span-1 text-right mr-2">
        {{ p.product_details.stock }}
      </p>
      <p class="col-span-1 text-right mr-2">{{ getSales(p) }}</p>
      <p class="col-span-1 text-right mr-2">{{ 0 }}</p>
      <p class="col-span-1 text-right mr-2">{{ getOS(p) }}</p>
      <p class="col-span-1 text-right mr-2">{{ getPO(p) }}</p>
    </div>

    <!-- Add another layer -->
    <div
      class="col-span-12 flex flex-col gap-4"
      v-if="props.category.sub_categories"
    >
      <StockStatusRow
        class="my-4"
        v-for="subCategory in props.category.sub_categories"
        :key="subCategory.id"
        :category="subCategory"
        :padding-left="props.paddingLeft + 1"
        :stock-status-event="statusEvent"
      />
    </div>

    <div class="col-span-12 gap-3 grid grid-cols-12 hover:bg-gray-50">
      <p
        :style="{ paddingLeft: `${props.paddingLeft}rem` }"
        class="col-span-7 font-bold"
      >
        Total {{ props.category.name }}
      </p>
      <p class="col-span-1 text-right mr-2 border-t-2 font-bold">
        {{ totalQuantity + quantities }}
      </p>
      <p class="col-span-1 text-right mr-2 border-t-2 font-bold">
        {{ totalSales + sales }}
      </p>
      <p class="col-span-1 text-right mr-2 border-t-2 font-bold">
        {{ totalAvailable + availables }}
      </p>
      <p class="col-span-1 text-right mr-2 border-t-2 font-bold">
        {{ totalOS + SOs }}
      </p>
      <p class="col-span-1 text-right mr-2 border-t-2 font-bold">
        {{ totalPO + POs }}
      </p>
    </div>
  </div>
</template>

<script setup>
import StockStatusRow from '@/components/Inventory/StockStatus/StockStatusRow.vue'

import { computed, watch, ref } from 'vue'
import Event from '@/event'

const props = defineProps({
  category: {
    type: Object,
    default: () => ({})
  },
  paddingLeft: {
    type: Number,
    default: 0
  },
  stockStatusEvent: {
    type: String,
    default: ''
  }
})

const sales = ref(0)
const quantities = ref(0)
const availables = ref(0)
const POs = ref(0)
const SOs = ref(0)

/** ================================================
 * EVENTS
 ** ================================================*/
const statusEvent = props.stockStatusEvent
  ? props.stockStatusEvent
  : `${props.category.id}-${props.category.name}`

// set event only if props.stockStatusEvent has no value
if (!props.stockStatusEvent) {
  Event.on(statusEvent, (data) => {
    quantities.value += data.totalQuantity
    sales.value += data.totalSales
    availables.value += data.totalAvailable
    POs.value += data.totalPO
    SOs.value += data.totalOS
  })
}

/** ================================================
 * COMPUTED
 ** ================================================*/
const totalSales = computed(() =>
  props.category.products.map((p) => getSales(p)).reduce((a, b) => a + b, 0)
)

const totalQuantity = computed(() =>
  props.category.products
    .map((p) => p.product_details.stock)
    .reduce((a, b) => a + b, 0)
)

const totalAvailable = computed(() => 0) // this is temporary and to be discuss pa

const totalOS = computed(() =>
  props.category.products.map((p) => getOS(p)).reduce((a, b) => a + b, 0)
)

const totalPO = computed(() =>
  props.category.products.map((p) => getPO(p)).reduce((a, b) => a + b, 0)
)

/** ================================================
 * METHODS
 ** ================================================*/
const getSales = (p) => {
  let quantitySold = 0

  p.invoice_products.forEach((ip) => {
    quantitySold += ip.quantity
  })

  return quantitySold
}

const getOS = (p) => {
  let salesOrders = 0

  p.so_products.forEach((sp) => {
    salesOrders += sp.quantity
  })

  return salesOrders
}

const getPO = (p) => {
  let purchaseOrders = 0

  p.po_products.forEach((po) => {
    purchaseOrders += po.quantity
  })

  return purchaseOrders
}

/** ================================================
 * WATCHERS
 ** ================================================*/
watch(
  () => [
    totalSales.value,
    totalOS.value,
    totalPO.value,
    totalQuantity.value,
    totalAvailable.value
  ],
  () => {
    if (props.stockStatusEvent) {
      Event.emit(props.stockStatusEvent, {
        totalSales: totalSales.value,
        totalOS: totalOS.value,
        totalPO: totalPO.value,
        totalQuantity: totalQuantity.value,
        totalAvailable: totalAvailable.value
      })
    }
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
