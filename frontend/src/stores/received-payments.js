import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useInvoiceStore } from './invoice'
import { useProductStore } from './product'

export const useReceivedPaymentsStore = defineStore('received-payments', () => {
  const receivedPayments = ref([])
  const receivedInvoicePayments = ref([])
  const invoiceStore = useInvoiceStore()
  const productStore = useProductStore()

  const registerReceivedPayment = async (data) => {
    const res = await api('received-payments', Method.POST, data)

    const isSuccess = res.status < 400

    if (isSuccess) {
      // Fetch all products
      await productStore.fetchAllProducts()

      const { received_payment } = res.data

      await fetchReceivedPayments()
      await invoiceStore.updateInvoiceStatus(
        received_payment.invoice_id,
        received_payment.invoice_status
      )
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

  const fetchReceivedPaymentById = async (id) => {
    const res = await api(`received-payments/${id}`)
    return res.data.received_payment
  }

  const fetchReceivedPaymentsByInvoiceId = async (invoiceId) => {
    const res = await api(`received-payments/invoice/${invoiceId}`)

    if (res.status < 400) {
      receivedInvoicePayments.value = res.data.received_payments
    }

    return res.data.received_payments
  }

  const fetchLatestReceivedPaymentsByInvoiceId = async (invoiceId) => {
    const res = await api(`received-payments/invoice/${invoiceId}/latest`)
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
      payment = await fetchReceivedPaymentById(id)
    }

    return payment
  }

  return {
    receivedPayments,
    receivedInvoicePayments,

    getReceivedPayments,
    fetchReceivedPayments,
    registerReceivedPayment,
    getReceivedPaymentsById,
    fetchReceivedPaymentById,
    fetchReceivedPaymentsByInvoiceId,
    fetchLatestReceivedPaymentsByInvoiceId
  }
})
