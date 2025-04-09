import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useVendorStore = defineStore('supplier', () => {
  const suppliers = ref([])
  const supplier = ref()

  const selectedSupplier = ref()

  const registerSupplier = async (data) => {
    const res = await api('suppliers/register', Method.POST, data)
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (suppliers.value.length) {
        suppliers.value.unshift(res.data.supplier)
      } else {
        await fetchAllSuppliers()
      }
    }

    return isSuccess
  }

  const updateSupplier = async (id, data) => {
    const res = await api(`suppliers/${id}`, Method.PUT, data)
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (suppliers.value.length) {
        const index = suppliers.value.findIndex((sup) => sup.id == id)
        if (index != -1) {
          suppliers.value[index] = res.data.supplier
        }
      } else {
        await fetchAllSuppliers()
      }
    }

    return isSuccess
  }

  const supplierOptions = computed(() => {
    return suppliers.value.map((sup) => {
      return {
        value: sup.id,
        text: sup.company_name
      }
    })
  })

  const fetchAllSuppliers = async () => {
    const res = await api('suppliers/all')
    if (res.status == 200) {
      suppliers.value = res.data.suppliers
    }
  }

  const fetchSupplierById = async (id) => {
    const res = await api(`suppliers/${id}`)
    if (res.status == 200) {
      supplier.value = res.data.supplier
    }
  }

  const getSupplierById = async (id) => {
    if (!supplier.value || supplier.value.id != id) {
      await fetchSupplierById(id)
    }

    return supplier.value
  }

  const getSuppliers = async () => {
    if (!suppliers.value.length) {
      await fetchAllSuppliers()
    }

    return suppliers.value
  }

  const removeSupplier = async (id) => {
    if (suppliers.value.length) {
      const index = suppliers.value.findIndex((sup) => sup.id == id)
      if (index != -1) {
        suppliers.value.splice(index, 1)
      }
    } else {
      await fetchAllSuppliers()
    }
  }

  return {
    supplier,
    suppliers,
    supplierOptions,
    selectedSupplier,

    // methods
    getSuppliers,
    updateSupplier,
    removeSupplier,
    getSupplierById,
    registerSupplier,
    fetchSupplierById,
    fetchAllSuppliers
  }
})
