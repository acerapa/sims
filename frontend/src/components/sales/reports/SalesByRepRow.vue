<template>
  <div class="flex flex-col gap-2 gen-table-row min-w-[1240px]">
    <p class="col-span-full text-sm font-bold">{{ repFullName }}</p>
    <div>
      <div
        class="flex flex-col gap-2 group/invoice"
        v-for="invoice in props.sales.invoices"
        :key="invoice.id"
      >
        <div
          class="grid grid-cols-20 gap-3 group/product"
          v-for="product in invoice.products"
        >
          <div class="col-span-3"></div>
          <p class="col-span-2 text-sm">
            {{
              new Date(invoice.issue_date).toLocaleString('default', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            }}
          </p>
          <p class="col-span-1 text-sm text-center">{{ invoice.id }}</p>
          <p class="col-span-4 text-sm">
            {{
              getFullName(
                invoice.customer.first_name,
                invoice.customer.last_name
              )
            }}
          </p>
          <p class="text-sm col-span-5">
            {{ product.product_details.sales_description }}
          </p>
          <p class="text-sm col-span-1 text-center">
            {{ product.InvoiceProducts.quantity }}
          </p>
          <p class="text-sm text-end col-span-2">
            {{ product.InvoiceProducts.price }}
          </p>
          <p
            class="text-sm text-end col-span-2 border-transparent group-last/invoice:border-black group-last/product:border-b-2"
          >
            {{ product.InvoiceProducts.total }}
          </p>
        </div>
      </div>
    </div>
    <div class="col-span-full grid grid-cols-20 gap-3">
      <p class="col-span-18 text-sm font-bold">Total {{ repFullName }}</p>
      <p class="col-span-2 text-sm font-bold text-end">
        {{ totalAmount.toFixed(2) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  sales: {
    type: Object,
    default: () => ({})
  }
})

const getFullName = (first_name, last_name) => {
  return [first_name, last_name].join(' ')
}

const repFullName = computed(() => {
  return getFullName(props.sales.first_name, props.sales.last_name)
})

const totalAmount = computed(() => {
  return props.sales.invoices
    .map((inv) => inv.total)
    .map((t) => parseFloat(t))
    .reduce((a, b) => a + b, 0)
})
</script>
