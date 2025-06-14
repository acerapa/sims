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
      <p class="col-span-1 text-right mr-2">{{ getOs(p) }}</p>
      <p class="col-span-1 text-right mr-2">{{ 0 }}</p>
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
      />
    </div>

    <div class="col-span-12 gap-3 grid grid-cols-12 hover:bg-gray-50">
      <p
        :style="{ paddingLeft: `${props.paddingLeft}rem` }"
        class="col-span-7 font-bold"
      >
        Total {{ props.category.name }}
      </p>
      <p class="col-span-1 text-right mr-2 border-t-2 font-bold">{{ 0 }}</p>
      <p class="col-span-1 text-right mr-2 border-t-2 font-bold">{{ 0 }}</p>
      <p class="col-span-1 text-right mr-2 border-t-2 font-bold">{{ 0 }}</p>
      <p class="col-span-1 text-right mr-2 border-t-2 font-bold">{{ 0 }}</p>
      <p class="col-span-1 text-right mr-2 border-t-2 font-bold">{{ 0 }}</p>
    </div>
  </div>
</template>

<script setup>
import StockStatusRow from '@/components/Inventory/StockStatus/StockStatusRow.vue'
const props = defineProps({
  category: {
    type: Object,
    default: () => ({})
  },
  paddingLeft: {
    type: Number,
    default: 0
  }
})

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

const getOs = (p) => {
  let salesOrders = 0

  p.so_products.forEach((sp) => {
    salesOrders += sp.quantity
  })

  return salesOrders
}
</script>
