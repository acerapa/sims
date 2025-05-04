import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReceivedPaymentsStore = defineStore('received-payments', () => {
  const receivedPayments = ref([])

  const registerReceivedPayment = async (data) => {
    const res = await api('received-payments', Method.POST, data)

    const isSuccess = res.status < 400

    if (isSuccess) {
      const { received_payment } = res.data
      receivedPayments.value.unshift(received_payment)
    }

    return isSuccess
  }

  const fetchReceivedPayments = async () => {
    const res = await api('received-payments')

    const isSuccess = res.status < 400

    if (isSuccess) {
      receivedPayments.value = res.data.received_payments
    }

    return isSuccess
  }

  const fetchReceivedPaymentsById = async (id) => {
    const res = await api(`received-payments/${id}`)
    return res.data.received_payment
  }

  // getters
  const getReceivedPayments = async () => {
    if (!receivedPayments.value.length) {
      await fetchReceivedPayments()
    }

    return receivedPayments.value
  }

  const getReceivedPaymentsById = async (id) => {
    let payment = receivedPayments.value.find((payment) => payment.id == id)

    if (!payment) {
      payment = await fetchReceivedPaymentsById(id)
    }

    return payment
  }

  return {
    receivedPayments,

    getReceivedPayments,
    fetchReceivedPayments,
    registerReceivedPayment,
    getReceivedPaymentsById,
    fetchReceivedPaymentsById
  }
})
