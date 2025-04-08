import { api } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDeliveryStore = defineStore('delivery', () => {
  const deliveries = ref([])

  const fetchDeliveries = async () => {
    const res = await api('deliveries')
    deliveries.value = res.data.deliveries

    return deliveries.value
  }

  return {
    deliveries,
    fetchDeliveries
  }
})
