import { authenticatedApi } from '@/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useVendorStore } from './supplier'

export const useProductStore = defineStore('product', () => {
  const supplierStore = useVendorStore()

  const items = ref([])
  const products = ref([])
  const services = ref([])
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

  const fetchAllItems = async () => {
    const res = await authenticatedApi('items/all')
    if (res.status == 200) {
      items.value = res.data.producs
    }
  }

  const fetchAllProducts = async () => {
    const res = await authenticatedApi('items/products')
    if (res.status == 200) {
      products.value = res.data.products
    }
  }

  const fetchAllServices = async () => {
    const res = await authenticatedApi('items/services')
    if (res.status == 200) {
      services.value = res.data.services
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

  const getServices = async () => {
    if (!services.value.length) {
      await fetchAllServices()
    }

    return services.value
  }

  const getProductItemCode = async () => {
    let itemCode = ''
    const res = await authenticatedApi('items/products/item-code')
    if (res.status == 200) {
      itemCode = res.data.item_code
    }
    return itemCode
  }

  return {
    items,
    products,
    services,
    supplierProducts,
    productOptions,

    getProducts,
    getServices,
    fetchAllItems,
    fetchAllProducts,
    fetchAllServices,
    getProductItemCode
  }
})
