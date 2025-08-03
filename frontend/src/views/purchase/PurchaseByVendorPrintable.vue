<template>
  <div class="bg-white py-8 print:py-0 flex flex-col gap-5">
    <PrintableHeader
      name="Purchase by Vendor Detailed Report"
      :sub_desctiption="formattedDateRange"
    />
    <div class="flex gap-3 flex-col px-10 mt-10">
      <!-- Header -->
      <div class="table-row text-sm border-b pb-3">
        <p class="col-span-3 font-bold">Supplier</p>
        <p class="col-span-1 font-bold">PO#</p>
        <p class="col-span-3 font-bold">D. Date</p>
        <p class="col-span-3 font-bold">D. No.</p>
        <p class="col-span-4 font-bold">Item Description</p>
        <p class="col-span-1 font-bold text-center">Quantity</p>
        <p class="col-span-2 font-bold text-end">Cost</p>
        <p class="col-span-2 font-bold text-end">Total</p>
      </div>
      <!-- Body -->
      <div
        class="table-row border-b pb-2 last:border-b-0"
        v-for="data in filteredData"
        :key="data.supplier.id"
      >
        <p class="col-span-19 text-xs font-bold">
          {{ data.supplier.company_name }}
        </p>
        <div
          class="table-row col-span-19 text-xs"
          v-for="po in data.pos"
          :key="po.id"
        >
          <p class="col-span-3"></p>
          <p class="col-span-1">#{{ po.id }}</p>
          <p class="col-span-3">
            {{
              DateHelpers.formatDate(new Date(po.received_date), 'YYYY-MM-DD')
            }}
          </p>
          <p class="col-span-3">{{ po.delivery_number }}</p>
          <div class="table-row col-span-19" v-for="product in po.products">
            <p class="col-span-10"></p>
            <p class="col-span-4">
              {{ product.product_details.purchase_description }}
            </p>
            <p class="col-span-1 text-center">
              {{ product.PurchaseOrderProducts.quantity }}
            </p>
            <p class="col-span-2 text-end">
              ₱ {{ product.PurchaseOrderProducts.cost }}
            </p>
            <p class="col-span-2 text-end">
              ₱ {{ product.PurchaseOrderProducts.amount }}
            </p>
          </div>
        </div>
        <p class="col-span-17 text-xs font-bold">
          {{ data.supplier.company_name }} Total
        </p>
        <p class="col-span-2 text-xs text-end border-t border-black font-bold">
          ₱ {{ getTotalAmount(data.pos).toFixed(2) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import PrintableHeader from '@/components/shared/PrintableHeader.vue'

import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePurchaseStore } from '@/stores/purchase'
import { DateHelpers } from 'shared'
import { formatDateRange } from '@/helper'

const route = useRoute()
const purchaseStore = usePurchaseStore()

const purchases = ref([])
const searchText = ref()

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return purchaseStore.purchaseByVendor.filter((pos) =>
    searchText.value
      ? pos.supplier.company_name
          .toLowerCase()
          .includes(searchText.value.toLowerCase())
      : true
  )
})

const formattedDateRange = computed(() =>
  formatDateRange(route.query.from, route.query.to)
)

/** ================================================
 * METHODS
 ** ================================================*/
const getTotalAmount = (pos) => {
  return pos.map((po) => parseFloat(po.amount)).reduce((a, b) => a + b, 0)
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  searchText.value = route.query.search_text
  // call api to get detailed vendor purchase report
  purchases.value = purchaseStore.fetchPurchaseByVendor(
    route.query.from,
    route.query.to
  )
})
</script>

<style scoped>
.table-row {
  @apply grid grid-cols-19 gap-3 print:gap-[4px];
}

.col-span-19 {
  grid-column: span 19 / span 19;
}

.col-span-17 {
  grid-column: span 17 / span 17;
}
</style>
