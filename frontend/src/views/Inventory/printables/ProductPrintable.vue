<template>
  <div class="bg-white py-8 print:py-0 flex flex-col gap-5">
    <PrintableHeader
      name="Product List"
      sub_desctiption="Product list and prices"
    />
    <div class="flex flex-col gap-3 px-10 mt-10">
      <!-- Header -->
      <div class="grid grid-cols-9 text-sm gap-3">
        <p class="col-span-1 font-bold">#</p>
        <p class="col-span-3 font-bold">Item Description</p>
        <p class="col-span-1 font-bold">Item Code</p>
        <p class="col-span-1 font-bold text-end">Price</p>
        <p class="col-span-1 font-bold text-end pr-2">Stock</p>
        <p class="col-span-1 font-bold">Added on</p>
        <p class="col-span-1 font-bold">Status</p>
      </div>

      <!-- Body -->
      <div class="flex flex-col gap-3">
        <div
          class="grid grid-cols-9 gap-3"
          :key="product.id"
          v-for="product in filteredProduct"
        >
          <p class="col-span-1 text-xs"># {{ product.id }}</p>
          <p class="col-span-3 text-xs">
            {{ product.product_details.sales_description }}
          </p>
          <p class="col-span-1 text-xs">
            {{ product.product_details.item_code }}
          </p>
          <p class="col-span-1 text-xs text-end">
            {{ product.price }}
          </p>
          <p class="col-span-1 text-xs text-end pr-3">
            {{ product.product_details.stock }}
          </p>
          <p class="col-span-1 text-xs">
            {{
              new Date(product.createdAt).toLocaleString('default', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            }}
          </p>
          <p class="col-span-1 text-xs">
            {{ getProductStatus(product) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PrintableHeader from '@/components/shared/PrintableHeader.vue'

import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { DateHelpers } from 'shared'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const productStore = useProductStore()
const { products } = storeToRefs(productStore)

const filteredProduct = computed(() => {
  return products.value.filter((product) => {
    const searchCondition =
      `${product.id} ${product.item_code} ${product.product_details.sales_description} ${product.quantity_in_stock} ${DateHelpers.formatDate(product.createdAt, 'M/D/YYYY')}`.toLowerCase()
    return route.query.searchText
      ? searchCondition.includes(route.query.searchText.toLowerCase())
      : product
  })
})

const getProductStatus = (product) => {
  if (
    product.product_details.product_setting &&
    product.product_details.stock >
      product.product_details.product_setting.point
  ) {
    return 'In Stock'
  } else if (
    product.product_details.product_setting &&
    product.product_details.stock <=
      product.product_details.product_setting.point
  ) {
    return 'Low Stock'
  } else if (product.product_details.stock <= 0) {
    return 'Out of Stock'
  } else {
    return '-'
  }
}

onMounted(async () => {
  await productStore.getProducts()
})
</script>
