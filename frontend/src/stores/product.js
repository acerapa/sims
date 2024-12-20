import { authenticatedApi } from '@/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useVendorStore } from './supplier'

export const useProductStore = defineStore('product', () => {
  const supplierStore = useVendorStore()

  const products = ref([])
  const supplierProducts = computed(() => {
    if (!supplierStore.selectedSupplier) return products.value
    return products.value.filter(
      (product) =>
        product.suppliers &&
        product.suppliers.length &&
        product.suppliers
          .map((sup) => sup.id)
          .includes(supplierStore.selectedSupplier.id)
    )
  })

  const fetchAllProducts = async () => {
    const res = await authenticatedApi('products/all')
    if (res.status == 200) {
      products.value = res.data.products
    }
  }

  const productOptions = computed(() => {
    return products.value.map((product) => {
      return {
        text: product.name,
        value: product.id
      }
    })
  })

  const getProducts = async () => {
    if (!products.value.length) {
      await fetchAllProducts()
    }

    return products.value
  }

  return {
    products,
    supplierProducts,
    productOptions,
    getProducts,
    fetchAllProducts
  }
})
