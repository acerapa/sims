import { authenticatedApi, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSalesStore = defineStore('sales', () => {
  const salesOrders = ref([])
  const salesOrder = ref()

  const createSalesOrder = async (data) => {
    const res = await authenticatedApi(
      'sales-order/register',
      Method.POST,
      data
    )

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (salesOrders.value.length) {
        salesOrders.value.unshift(res.data.salesOrder)
      } else {
        // call a method to fetch sales orders
        // Ex. await fetchSalesOrders()
      }
    }

    return isSuccess
  }

  const fetchSalesOrders = async () => {
    const res = await authenticatedApi('sales-order/all')
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

  return {
    salesOrder,
    salesOrders,
    getSalesOrders,
    fetchSalesOrders,
    createSalesOrder
  }
})
