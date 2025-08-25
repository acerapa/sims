<template>
  <div class="grid grid-cols-15 gap-3">
    <p
      :style="{ paddingLeft: `${props.depth * 12}px` }"
      class="col-span-full text-sm font-bold"
    >
      {{ props.sales[0] }}
    </p>
    <div class="col-span-full">
      <div v-for="p in Object.entries(props.sales[1])">
        <SalesByItemPrintableRow
          :sales="p"
          v-if="p[0] != 'products'"
          :depth="props.depth + 1"
        />
      </div>
    </div>
    <div class="col-span-full">
      <div
        class="group"
        v-if="props.sales[1].products"
        v-for="product in props.sales[1].products"
      >
        <div
          class="grid grid-cols-15 gap-3"
          v-for="invoice in product.invoices"
        >
          <p class="col-span-3" />
          <p class="col-span-2 text-sm">
            {{
              DateHelpers.formatDate(new Date(invoice.issue_date), 'YYYY-MM-DD')
            }}
          </p>
          <p class="col-span-1 text-sm">{{ product.id }}</p>
          <p class="col-span-3 text-sm">
            {{ invoice.memo || '-' }}
          </p>
          <p class="col-span-3 text-sm">
            {{ product.product_details.sales_description }}
          </p>
          <p class="col-span-1 text-sm text-center">
            {{ invoice.InvoiceProducts.quantity }}
          </p>
          <p class="col-span-1 text-sm text-end">
            {{ invoice.InvoiceProducts.price }}
          </p>
          <p
            class="col-span-1 text-sm text-end border-black group-last:border-b"
          >
            {{ invoice.InvoiceProducts.total }}
          </p>
        </div>
      </div>
    </div>
    <p
      :style="{ paddingLeft: `${props.depth * 12}px` }"
      class="col-span-14 text-sm font-bold"
    >
      Total {{ props.sales[0] }}
    </p>
    <p class="col-span-1 text-end text-sm font-bold">
      {{ getTotalAmount().toFixed(2) }}
    </p>
  </div>
</template>

<script setup>
import SalesByItemPrintableRow from '@/components/sales/SalesByItemPrintableRow.vue'
import { DateHelpers } from 'shared'
const props = defineProps({
  sales: {
    type: Object,
    default: () => ({})
  },
  depth: {
    type: Number,
    default: 0
  }
})

const getTotalAmount = (s = props.sales[1]) => {
  let total = 0

  const getTotal = (s) => {
    const salesKeys = Object.keys(s)

    for (const key of salesKeys) {
      if (key === 'products') {
        total += s.products
          .map((product) =>
            product.invoices.map((invoice) =>
              parseFloat(invoice.InvoiceProducts.total)
            )
          )
          .flat()
          .reduce((a, b) => a + b, 0)
      } else {
        getTotal(s[key])
      }
    }
  }

  getTotal(s)

  return total
}
</script>
