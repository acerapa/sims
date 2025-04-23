import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDeliveryStore = defineStore('delivery', () => {
  const delivery = ref({})
  const deliveries = ref([])

  const fetchDeliveries = async () => {
    const res = await api('deliveries')
    deliveries.value = res.data.deliveries

    return deliveries.value
  }

  const fetchDeliveryById = async (id) => {
    const res = await api(`deliveries/${id}`)

    const isSuccess = res.status < 400

    if (isSuccess) {
      delivery.value = res.data.delivery
    }

    return isSuccess
  }

  const getDeliveryById = async (id) => {
    if (!delivery.value || delivery.value.id != id) {
      await fetchDeliveryById(id)
    }

    return delivery.value
  }

  const updateDeliveryStatus = async (id, statusData) => {
    const res = await api(`deliveries/${id}/status`, Method.PATCH, statusData)

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (deliveries.value.length) {
        const index = deliveries.value.findIndex((item) => item.id == id)
        deliveries.value[index] = res.data.delivery
      }

      if (delivery.value && delivery.value.id == id) {
        delivery.value = res.data.delivery
      }

      if (!deliveries.value.length) {
        await fetchDeliveries()
      }
    }

    return isSuccess
  }

  return {
    delivery,
    deliveries,
    getDeliveryById,
    fetchDeliveries,
    updateDeliveryStatus
  }
})
