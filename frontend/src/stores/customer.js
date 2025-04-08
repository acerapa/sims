import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref([])
  const customer = ref()

  const fetchCustomers = async () => {
    const res = await api('customers/all')

    if (res.status < 400) {
      customers.value = res.data.customers
    }
  }

  const getCustomers = async () => {
    if (!customers.value.length) {
      await fetchCustomers()
    }

    return customers.value
  }

  const createCustomer = async (model) => {
    const res = await api('customers/register', Method.POST, model)

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (customers.value.length) {
        customers.value.unshift(res.data.customer)
      } else {
        await fetchCustomers()
      }
    }

    return isSuccess
  }

  const updateCustomer = async (id, model) => {
    const res = await api(`customers/${id}/update`, Method.POST, model)

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (customers.value.length) {
        const index = customers.value.findIndex((c) => c.id == id)
        if (index > -1) {
          customers.value[index] = res.data.customer
        }
      } else {
        await fetchCustomers()
      }
    }

    return isSuccess
  }

  const fetchCustomerById = async (id) => {
    const res = await api(`customers/${id}`)

    if (res.status < 400) {
      customer.value = res.data.customer
    }
  }

  const getCustomer = async (id) => {
    const cst = customers.value.find((c) => c.id === id)
    if (customer.value && customer.value.id === id) {
      return customer.value
    } else {
      if (customers.value.length && cst) {
        customer.value = cst
      } else {
        await fetchCustomerById()
      }
    }

    return customer.value
  }

  return {
    customer,
    customers,
    getCustomer,
    getCustomers,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    fetchCustomerById
  }
})
