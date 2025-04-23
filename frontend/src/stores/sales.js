import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSalesStore = defineStore('sales', () => {
  const salesOrders = ref([])
  const salesOrder = ref()

  const createSalesOrder = async (data) => {
    const res = await api('sales-order/register', Method.POST, data)

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (salesOrders.value.length) {
        salesOrders.value.unshift(res.data.order)
      } else {
        await fetchSalesOrders()
      }
    }

    return isSuccess
  }

  const updateSalesOrder = async (id, data) => {
    const res = await `api`(`sales-order/${id}`, Method.PUT, data)

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (salesOrders.value.length) {
        const index = salesOrders.value.findIndex((item) => item.id == id)
        salesOrders.value[index] = res.data.order
      } else {
        await fetchSalesOrders()
      }

      if (salesOrder.value && salesOrder.value.id == id) {
        salesOrder.value = res.data.order
      }
    }

    return isSuccess
  }

  const fetchSalesOrders = async () => {
    const res = await api('sales-order/all')
    const isSuccess = res.status < 400

    if (isSuccess) {
      salesOrders.value = res.data.orders
    }

    return isSuccess
  }

  const getSalesOrders = async () => {
    if (!salesOrders.value.length) {
      await fetchSalesOrders()
    }

    return salesOrders.value
  }

  const fetchSalesOrder = async (id) => {
    const res = await api(`sales-order/${id}`)
    const isSuccess = res.status < 400

    if (isSuccess) salesOrder.value = res.data.order

    return isSuccess
  }

  const getSalesOrder = async (id) => {
    if (!salesOrder.value || salesOrder.value.id != id) {
      await fetchSalesOrder(id)
    }

    return salesOrder.value
  }

  const removeSalesOrder = async (id) => {
    if (salesOrders.value.length) {
      salesOrders.value = salesOrders.value.filter((item) => item.id != id)
    } else {
      await fetchSalesOrders()
    }
  }

  return {
    salesOrder,
    salesOrders,
    getSalesOrder,
    getSalesOrders,
    fetchSalesOrder,
    fetchSalesOrders,
    createSalesOrder,
    removeSalesOrder,
    updateSalesOrder
  }
})
