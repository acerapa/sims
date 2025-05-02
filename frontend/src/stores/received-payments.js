import { defineStore } from 'pinia'

export const useReceivedPaymentsStore = defineStore('received-payments', () => {
  const receivedPayments = ref([])

  return {
    receivedPayments
  }
})
