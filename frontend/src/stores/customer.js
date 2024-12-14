import { authenticatedApi, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref([])
  const customer = ref()

  const fetchCustomers = async () => {
    const res = await authenticatedApi('customers/all')

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
    const res = await authenticatedApi('customers/register', Method.POST, model)

    return res.status < 400
  }

  const updateCustomer = async (id, model) => {
    const res = await authenticatedApi(
      `customers/${id}/update`,
      Method.POST,
      model
    )

    return res.status < 400
  }

  const fetchCustomerById = async (id) => {
    const res = await authenticatedApi(`customers/${id}`)

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
