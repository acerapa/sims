<template>
  <div class="bg-white py-8 print:py-0 flex flex-col gap-5">
    <PrintableHeader name="Sales by customer detailed report" />
    <div class="flex gap-3 flex-col px-10 mt-10">
      <!-- Header -->
      <div class="grid grid-cols-15 gap-3 border-b pb-3">
        <p class="col-span-3 font-bold print:text-sm">Customer</p>
        <p class="col-span-1 font-bold print:text-sm text-center"># Inv.</p>
        <p class="col-span-2 font-bold print:text-sm">Inv. Date</p>
        <p class="col-span-4 font-bold print:text-sm">Item Description</p>
        <p class="col-span-1 font-bold print:text-sm text-center">Qty.</p>
        <p class="col-span-2 font-bold print:text-sm text-end">Price</p>
        <p class="col-span-2 font-bold print:text-sm text-end">Total</p>
      </div>
      <!-- Body -->
      <div
        class="grid grid-cols-15 border-b pb-3 last:border-b-0"
        v-for="customer in filteredData"
        :key="customer.id"
      >
        <p class="col-span-15 text-sm print:text-xs font-bold">
          {{ [customer.first_name, customer.last_name].join(' ') }}
        </p>
        <div
          class="col-span-15 grid grid-cols-15 gap-3"
          v-for="(invoice, invoiceNdx) in customer.invoices"
          :key="invoice.id"
        >
          <p class="col-span-3" />
          <p class="col-span-1 text-sm print:text-xs text-center">
            #{{ invoice.id }}
          </p>
          <p class="col-span-2 text-sm print:text-xs">
            {{
              DateHelpers.formatDate(new Date(invoice.issue_date), 'YYYY-MM-DD')
            }}
          </p>
          <div
            class="col-span-15 grid grid-cols-15 gap-3"
            v-for="(product, productNdx) in invoice.products"
            :key="product.id"
          >
            <p class="col-span-6" />
            <p class="col-span-4 text-sm print:text-xs">
              {{ product.product_details.sales_description }}
            </p>
            <p class="col-span-1 text-sm print:text-xs text-center">
              {{ product.InvoiceProducts.quantity }}
            </p>
            <p class="col-span-2 text-sm print:text-xs text-end">
              {{ product.InvoiceProducts.price }}
            </p>
            <p
              class="col-span-2 text-sm print:text-xs text-end"
              :class="[
                invoiceNdx == customer.invoices.length - 1 &&
                productNdx == invoice.products.length - 1
                  ? 'border-b border-black'
                  : ''
              ]"
            >
              {{ product.InvoiceProducts.total }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-15 gap-3 col-span-15">
          <p class="col-span-13 text-sm print:text-xs font-bold">
            Total {{ [customer.first_name, customer.last_name].join(' ') }}
          </p>
          <p class="col-span-2 text-sm print:text-xs font-bold text-end">
            {{ totalInvoiceAmount(customer) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PrintableHeader from '@/components/shared/PrintableHeader.vue'
import { useInvoiceStore } from '@/stores/invoice'
import { storeToRefs } from 'pinia'
import { DateHelpers } from 'shared'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const invoiceStore = useInvoiceStore()
const { invoicesByCustomer } = storeToRefs(invoiceStore)

const searchText = ref('')

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return invoicesByCustomer.value.filter((customer) => {
    const searchCondition =
      `${customer.first_name} ${customer.last_name}`.toLowerCase()
    return searchText.value
      ? searchCondition.includes(searchText.value.toLowerCase())
      : true
  })
})

const totalInvoiceAmount = (customer) => {
  return customer.invoices
    .map((invoice) => parseFloat(invoice.total))
    .reduce((a, b) => a + b, 0)
    .toFixed(2)
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  searchText.value = route.query.search_text
  await invoiceStore.fetchInvoiceByCustomer(route.query.from, route.query.to)
})
</script>
