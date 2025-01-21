import { authenticatedApi, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useServiceStore = defineStore('service', () => {
  const services = ref([])
  const service = ref(null)

  const fetchServices = async () => {
    const res = await authenticatedApi('services')
    if (res.status < 400) {
      services.value = res.data.services
    }
  }

  const fetchService = async (id) => {
    const res = await authenticatedApi(`services/${id}`)
    if (res.status < 400) {
      service.value = res.data.service
    }
  }

  const getServices = async () => {
    if (!services.value.length) {
      await fetchServices()
    }

    return services.value
  }

  const registerService = async (service) => {
    const res = await authenticatedApi(
      'services/register',
      Method.POST,
      service
    )

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (!services.value.length) {
        await fetchServices()
      } else {
        services.value.unshift(res.data.service)
      }
    }

    return isSuccess
  }

  return {
    services,

    fetchServices,
    registerService,

    getServices
  }
})
