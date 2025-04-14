import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInvoiceStore = defineStore('invoice', () => {
  const invoices = ref([])

  const fetchInvoices = async () => {
    const res = await api('invoices')

    const isSuccess = res.status < 400

    if (isSuccess) {
      invoices.value = res.data.invoices
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

  return {
    invoices,

    createInvoice,
    fetchInvoices
  }
})
