<template>
  <div
    class="grid grid-cols-12 gap-3 gen-table-row group/customer last:group/customer"
  >
    <p class="col-span-2 text-sm font-bold">{{ customerName }}</p>
    <div
      class="col-span-12 grid grid-cols-12 gap-3 group-last:group/invoice"
      v-for="(invoice, invoiceNdx) in customer.invoices"
      :key="invoice.id"
    >
      <p class="col-span-2" />
      <RouterLink
        class="col-span-1 text-sm hover:underline hover:text-primary font-bold"
        :to="{
          name: SalesConst.INVOICE_FORM,
          query: { id: invoice.id }
        }"
        >#{{ invoice.id }}</RouterLink
      >
      <p class="col-span-2 text-sm">
        {{
          new Date(invoice.issue_date).toLocaleString('default', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          })
        }}
      </p>
      <div
        class="col-span-12 grid grid-cols-12 gap-3 group-last:group/product"
        v-for="(product, productNdx) in invoice.products"
        :key="product.id"
      >
        <p class="col-span-5" />
        <p class="col-span-4 text-sm">
          {{ product.product_details.sales_description }}
        </p>
        <p class="col-span-1 text-sm text-center">
          {{ product.InvoiceProducts.quantity }}
        </p>
        <p class="col-span-1 text-sm text-end">
          {{ product.InvoiceProducts.price }}
        </p>
        <p
          class="col-span-1 text-sm text-end"
          :class="[
            invoiceNdx == customer.invoices.length - 1 &&
            productNdx == invoice.products.length - 1
              ? 'border-b border-black'
              : ''
          ]"
        >
          {{ product.InvoiceProducts.total }}
        </p>
        <p class="col-span-1 text-sm text-end">Balace</p>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-3 col-span-12">
      <p class="col-span-11 text-sm font-bold">Total {{ customerName }}</p>
      <p class="col-span-1 text-sm font-bold text-end">
        {{ totalInvoiceAmount }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { SalesConst } from '@/const/route.constants'

const props = defineProps({
  customer: {
    type: Object,
    default: () => ({})
  }
})

const customerName = computed(() =>
  [props.customer.first_name, props.customer.last_name].join(' ')
)

const totalInvoiceAmount = computed(() => {
  return props.customer.invoices
    .map((invoice) => parseFloat(invoice.total))
    .reduce((a, b) => a + b, 0)
    .toFixed(2)
})
</script>
