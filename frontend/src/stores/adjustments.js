import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useProductStore } from './product'

export const useAdjustmentsStore = defineStore('adjustments', () => {
  const adjustment = ref(null)
  const adjustments = ref([])

  const productStore = useProductStore()

  const fetchAdjustments = async () => {
    const res = await api('/physical-inventory-adjustments')

    const isSuccess = res.status < 400
    if (isSuccess) {
      adjustments.value = res.data.adjustments
    }

    return isSuccess
  }

  const fetchAdjustment = async (id) => {
    const res = await api(`/physical-inventory-adjustments/${id}`)

    const isSuccess = res.status < 400

    if (isSuccess) {
      adjustment.value = res.data.adjustment
    }

    return isSuccess
  }

  const registerAdjustment = async (model) => {
    const res = await api(`/physical-inventory-adjustments`, Method.POST, model)

    const isSuccess = res.status < 400

    if (isSuccess) {
      await productStore.fetchAllProducts()
    }

    return isSuccess
  }


  // getters
  const getAdjustments = async () => {
    if (!adjustments.value.length) {
      await fetchAdjustments()
    }

    return adjustments.value
  }

  return {
    adjustment,
    adjustments,

    fetchAdjustment,
    fetchAdjustments,
    registerAdjustment,

    getAdjustments
  }
})
