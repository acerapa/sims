import { authenticatedApi, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSalesStore = defineStore('sales', () => {
  const salesOrders = ref([])
  const salesOrder = ref()

  const createSalesOrder = async (data) => {
    const res = await authenticatedApi(
      'sales-orders/register',
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

  return {
    salesOrder,
    salesOrders,
    createSalesOrder
  }
})
