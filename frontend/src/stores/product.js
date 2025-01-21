import { authenticatedApi, Method } from '@/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useVendorStore } from './supplier'

export const useProductStore = defineStore('product', () => {
  const supplierStore = useVendorStore()

  const items = ref([])
  const products = ref([])
  const services = ref([])
  const product = ref(null)

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

  const registerProduct = async (product) => {
    const res = await authenticatedApi(
      'items/products/register',
      Method.POST,
      product
    )

    return res.status < 400
  }

  const updateProduct = async (id, product) => {
    const res = await authenticatedApi(
      `items/products/${id}`,
      Method.PUT,
      product
    )

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (products.value.length) {
        const index = products.value.findIndex((product) => product.id == id)
        await fetchProduct(id)

        if (index > -1 && product.value) {
          products.value[index] = product.value
        }

        product.value = null
      } else {
        await fetchAllProducts()
      }
    }

    return isSuccess
  }

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

  const fetchProduct = async (id) => {
    const res = await authenticatedApi(`items/products/${id}`)
    if (res.status < 400) {
      product.value = res.data.product
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

  const getProduct = async (id) => {
    if (!product.value || product.value.id != id) {
      product.value = products.value.find((product) => product.id == id)

      if (!product.value) {
        await fetchProduct(id)
      }
    }

    return product.value
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

  const removeProduct = async (id) => {
    if (products.value.length) {
      const index = products.value.findIndex((product) => product.id == id)
      products.value.splice(index, 1)
    } else {
      await fetchAllProducts()
    }
  }

  return {
    items,
    product,
    products,
    services,
    supplierProducts,
    productOptions,

    getProduct,
    getProducts,
    getServices,
    fetchAllItems,
    updateProduct,
    removeProduct,
    registerProduct,
    fetchAllProducts,
    fetchAllServices,
    getProductItemCode
  }
})
