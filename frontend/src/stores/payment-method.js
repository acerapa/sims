import { authenticatedApi, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePaymentMethodStore = defineStore('payment-method', () => {
  const paymentMethods = ref([])
  const paymentMethod = ref(null)

  const fetchPaymentMethods = async () => {
    const res = await authenticatedApi('payment-method/')
    const isSuccess = res.status < 400

    if (isSuccess) {
      paymentMethods.value = res.data.paymentMethods
    }

    return isSuccess
  }

  const fetchPaymentMethodById = async (id) => {
    const res = await authenticatedApi(`payment-method/${id}/`)
    const isSuccess = res.status < 400

    if (isSuccess) {
      paymentMethod.value = res.data.paymentMethod
    }

    return isSuccess
  }

  const registerPaymentMethod = async (data) => {
    const res = await authenticatedApi('payment-method/', Method.POST, data)
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (paymentMethods.value.length) {
        paymentMethods.value.unshift(res.data.paymentMethod)
      } else {
        await fetchPaymentMethods()
      }
    }

    return isSuccess
  }

  const updatePaymentMethod = async (id, data) => {
    const res = await authenticatedApi(`payment-method/${id}`, Method.PUT, data)
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (paymentMethods.value.length) {
        const index = paymentMethods.value.findIndex((pm) => pm.id === id)
        paymentMethods.value[index] = res.data.paymentMethod
      } else {
        await fetchPaymentMethods()
      }

      if (paymentMethod.value.id === id) {
        paymentMethod.value = res.data.paymentMethod
      }
    }

    return isSuccess
  }

  const getPaymentMethods = async () => {
    if (!paymentMethods.value.length) {
      await fetchPaymentMethods()
    }

    return paymentMethods.value
  }

  const getPaymentMethod = async (id) => {
    if (!paymentMethod.value) {
      await fetchPaymentMethodById(id)
    }

    return paymentMethod.value
  }

  const removePaymentMethod = async (id) => {
    paymentMethods.value = paymentMethods.value.filter((pm) => pm.id != id)
  }

  return {
    paymentMethod,
    paymentMethods,
    getPaymentMethod,
    getPaymentMethods,
    fetchPaymentMethods,
    updatePaymentMethod,
    removePaymentMethod,
    registerPaymentMethod
  }
})
