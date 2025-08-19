<template>
  <div class="bg-white py-8 print:py-0 flex flex-col gap-5">
    <PrintableHeader
      name="Sales By Item Detailed Report"
      sub_desctiption="No content"
    />

    <div class="flex flex-col gap-3 px-10 mt-10">
      <!-- Header -->
      <div class="table-row text-sm border-b pb-3">
        <p class="col-span-3 font-bold">Type</p>
        <p class="col-span-2 font-bold">Date</p>
        <p class="col-span-1 font-bold"># Item</p>
        <p class="col-span-3 font-bold">Memo</p>
        <p class="col-span-3 font-bold">Name</p>
        <p class="col-span-1 font-bold text-center">Qty</p>
        <p class="col-span-1 font-bold text-end">Price</p>
        <p class="col-span-1 font-bold text-end">Amount</p>
      </div>

      <!-- Body -->
      <div
        class="table-row border-b pb-2 last:border-b-0"
        v-for="(item, ndx) in data"
        :key="ndx"
      >
        <SalesByItemPrintableRow
          class="col-span-full"
          :sales="item"
          :depth="0"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import PrintableHeader from '@/components/shared/PrintableHeader.vue'
import SalesByItemPrintableRow from '@/components/sales/SalesByItemPrintableRow.vue'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

// TODO: Will implement this soon when the filters are discussed
// import { useRoute } from 'vue-router'
// const route = useRoute()

const productStore = useProductStore()
const { salesByItem } = storeToRefs(productStore)

const data = computed(() => Object.entries(salesByItem.value))

onMounted(async () => {
  await productStore.fetchSalesByItem()
  console.log(data.value)
})
</script>

<style scoped>
.table-row {
  @apply grid grid-cols-15 gap-3 print:gap-[4px];
}
</style>
