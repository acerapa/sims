import { authenticatedApi } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePaymentMethodStore = defineStore('payment-method', () => {
  const paymentMethods = ref([])

  const fetchPaymentMethods = async () => {
    const res = await authenticatedApi('payment-method/')
    const isSuccess = res.status < 400

    if (isSuccess) {
      paymentMethods.value = res.data.paymentMethods
    }

    return isSuccess
  }

  const getPaymentMethods = async () => {
    if (!paymentMethods.value.length) {
      await fetchPaymentMethods()
    }

    return paymentMethods.value
  }

  return {
    paymentMethods,
    getPaymentMethods,
    fetchPaymentMethods
  }
})
