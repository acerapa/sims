import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInvoiceStore = defineStore('invoice', () => {
  const invoice = ref()
  const invoices = ref([])

  const fetchInvoices = async () => {
    const res = await api('invoices')

    const isSuccess = res.status < 400

    if (isSuccess) {
      invoices.value = res.data.invoices
    }

    return isSuccess
  }

  const fetchInvoiceById = async (id) => {
    const res = await api(`invoices/${id}`)

    const isSuccess = res.status < 400

    if (isSuccess) {
      invoice.value = res.data.invoice
    }

    return isSuccess
  }

  const createInvoice = async (model) => {
    const res = await api('invoices', Method.POST, model)

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (invoices.value.length) {
        invoices.value.unshift(res.data.invoice)
      } else {
        await fetchInvoices()
      }
    }

    return isSuccess
  }

  const updateInvoice = async (id, model) => {
    const res = await api(`invoices/${id}`, Method.PUT, model)
    const isSuccess = res.status < 400

    if (isSuccess) {
      await fetchInvoiceById(id)
    }

    return isSuccess
  }

  // getters
  const getInvoices = async () => {
    if (!invoices.value.length) {
      await fetchInvoices()
    }

    return invoices.value
  }

  return {
    invoice,
    invoices,

    getInvoices,
    updateInvoice,
    createInvoice,
    fetchInvoices,
    fetchInvoiceById
  }
})
