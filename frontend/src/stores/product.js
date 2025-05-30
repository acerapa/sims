import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useVendorStore } from './supplier'

export const useProductStore = defineStore('product', () => {
  const supplierStore = useVendorStore()

  const products = ref([])
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
    const res = await api('products/register', Method.POST, product)

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (products.value.length) {
        products.value.unshift(res.data.product)
      } else {
        await fetchAllProducts()
      }
    }

    return isSuccess
  }

  const updateProduct = async (id, data) => {
    const res = await api(`products/${id}`, Method.PUT, data)

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (products.value.length) {
        const index = products.value.findIndex((product) => product.id == id)
        await fetchProduct(id)

        if (index > -1 && product.value) {
          const p = [...products.value]
          p[index] = product.value
          products.value = p
        }

        product.value = null
      } else {
        await fetchAllProducts()
      }
    }

    return isSuccess
  }

  const fetchAllProducts = async () => {
    const res = await api('products')
    if (res.status == 200) {
      products.value = res.data.products
    }
  }

  const fetchProduct = async (id) => {
    const res = await api(`products/${id}`)
    if (res.status < 400) {
      product.value = res.data.product
    }
  }

  const fetchProductByIds = async (ids) => {
    const params = new URLSearchParams()
    ids.forEach((param, index) => {
      params.append(`ids[${index}]`, param)
    })
    const res = await api(`products/by-ids?${params.toString()}`)

    if (res.status < 400) {
      if (products.value.length) {
        res.data.products.forEach((p) => {
          const index = products.value.findIndex((prd) => prd.id == p.id)

          if (index > -1) {
            products.value[index] = p
          }
        })
      } else {
        await fetchAllProducts()
      }
    }
  }

  const productOptions = computed(() => {
    return products.value.map((product) => {
      return {
        text: product.product_details.purchase_description,
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

  const getProductItemCode = async () => {
    let itemCode = ''
    const res = await api('products/item-code')
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

  const checkProductItemCodeExist = async (itemCode) => {
    const res = await api(`products/check-item-code/${itemCode}`, Method.POST)
    return res.data.is_exist
  }

  return {
    product,
    products,
    supplierProducts,
    productOptions,

    getProduct,
    getProducts,
    updateProduct,
    removeProduct,
    registerProduct,
    fetchAllProducts,
    fetchProductByIds,
    getProductItemCode,
    checkProductItemCodeExist
  }
})
