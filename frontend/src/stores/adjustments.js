import { api, Method } from '@/api'
import { defineStore } from 'pinia'

export const useAdjustmentsStore = defineStore('adjustments', () => {
  const adjustments = ref([])

  const registerAdjustment = async (model) => {
    const res = await api(`/physical-inventory-adjustments`, Method.POST, model)

    const isSuccess = res.status < 400

    return isSuccess
  }

  return {
    adjustments,

    registerAdjustment
  }
})
