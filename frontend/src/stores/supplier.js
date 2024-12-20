import { authenticatedApi } from '@/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useVendorStore = defineStore('supplier', () => {
  const suppliers = ref([])
  const supplier = ref()

  const selectedSupplier = ref()

  const supplierOptions = computed(() => {
    return suppliers.value.map((sup) => {
      return {
        value: sup.id,
        text: sup.company_name
      }
    })
  })

  const fetchAllSuppliers = async () => {
    const res = await authenticatedApi('suppliers/all')
    if (res.status == 200) {
      suppliers.value = res.data.suppliers
    }
  }

  const fetchSupplierById = async (id) => {
    const res = await authenticatedApi(`suppliers/${id}`)
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

  return {
    supplier,
    suppliers,
    supplierOptions,
    selectedSupplier,

    // methods
    getSupplierById,
    fetchSupplierById,
    fetchAllSuppliers
  }
})
