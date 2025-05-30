import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useProductStore } from './product'

export const usePurchaseOrderStore = defineStore('purchase-order', () => {
  const purchaseOrders = ref([])
  const purchaseOrder = ref(null)
  const { fetchProductByIds } = useProductStore()

  const fetchPurchaseOrders = async () => {
    const res = await api('/purchase-order/all')
    if (res.status == 200) {
      purchaseOrders.value = res.data.orders
    }
  }

  const fetchPurchaseOrderById = async (id) => {
    const res = await api('purchase-order/' + id)
    if (res.status == 200) {
      purchaseOrder.value = res.data.order
    }
  }

  const receivePurchaseOrder = async (id, data) => {
    const res = await api(
      `purchase-order/${id}/receive-order`,
      Method.PUT,
      data
    )

    const productIds = data.products.map((p) => p.product_id)
    await fetchProductByIds(productIds)

    return res.status < 400
  }

  const createPurchaseOrder = async (data) => {
    const res = await api('/purchase-order/register', Method.POST, data)
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (purchaseOrders.value.length) {
        purchaseOrders.value.unshift(res.data.order)
      } else {
        await fetchPurchaseOrders()
      }
    }

    return isSuccess
  }

  const updatePurchaseOrder = async (id, data) => {
    const res = await api(`purchase-order/${id}`, Method.PUT, data)
    const isSuccess = res.status < 400

    if (isSuccess) {
      // update purchase order
      if (purchaseOrder.value.id == id) {
        purchaseOrder.value = res.data.order
      }

      // update purchase orders
      if (purchaseOrders.value.length) {
        const index = purchaseOrders.value.findIndex((order) => order.id == id)
        if (index > -1) {
          purchaseOrders.value[index] = res.data.order
        }
      } else {
        await fetchPurchaseOrders()
      }
    }

    return isSuccess
  }

  const getPurchaseOrders = async () => {
    if (purchaseOrders.value.length) {
      return purchaseOrders.value
    } else {
      return await fetchPurchaseOrders()
    }
  }

  const getPurchaseOrder = async (id) => {
    if (!purchaseOrder.value || purchaseOrder.value.id != id) {
      await fetchPurchaseOrderById(id)
    }

    return purchaseOrder.value
  }

  return {
    purchaseOrder,
    purchaseOrders,
    getPurchaseOrder,
    getPurchaseOrders,
    createPurchaseOrder,
    fetchPurchaseOrders,
    updatePurchaseOrder,
    receivePurchaseOrder,
    fetchPurchaseOrderById
  }
})
