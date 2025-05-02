import { api, Method } from '@/api'
import { defineStore } from 'pinia'

export const useReceivedPaymentsStore = defineStore('received-payments', () => {
  const receivedPayments = ref([])

  const registerReceivedPayment = async (data) => {
    const res = await api('/received-payments', Method.POST, data)

    const isSuccess = res.status < 400

    if (isSuccess) {
      const { received_payment } = res.data
      receivedPayments.value.unshift(received_payment)
    }

    return isSuccess
  }

  return {
    receivedPayments,

    registerReceivedPayment
  }
})
