import { authenticatedApi, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const productCategories = ref([])
  const accounts = ref([])
  const branches = ref([])
  const productReorderingPoints = ref([])

  const fetchAllProductCategories = async () => {
    const res = await authenticatedApi('product-category/all')
    if (res.status == 200) {
      productCategories.value = res.data.categories
    }

    return res.data.categories
  }

  const fetchAllAccounts = async () => {
    const res = await authenticatedApi('settings/accounts/all')
    if (res.status == 200) {
      accounts.value = res.data.accounts
    }
    return res.data.accounts
  }

  const fetchAllProductReorderingPoints = async () => {
    const res = await authenticatedApi('product-setting/all')
    if (res.status == 200) {
      productReorderingPoints.value = res.data.productReorderingPoints
    }

    return res.data.productReorderingPoints
  }

  const categoryOption = async () => {
    const cats = productCategories.value.length
      ? productCategories.value
      : await fetchAllProductCategories()

    return cats.map((category) => {
      return {
        text: category.name,
        value: category.id
      }
    })
  }

  const getReorderingPoints = async () => {
    if (!productReorderingPoints.value.length) {
      await fetchAllProductReorderingPoints()
    }

    return productReorderingPoints.value
  }

  const getAccounts = async () => {
    if (!accounts.value.length) {
      await fetchAllAccounts()
    }

    return accounts.value
  }

  const getProductCategories = async () => {
    if (!productCategories.value.length) {
      await fetchAllProductCategories()
    }

    return productCategories.value
  }

  const getProductCategoryByIdSync = (id) => {
    return productCategories.value.find((cat) => cat.id == id)
  }

  const getProductCategoryByIdAsync = async (id) => {
    let category = getProductCategoryByIdSync(id)

    if (!category) {
      await fetchAllProductCategories()
      category = getProductCategoryByIdSync(id)
    }

    return category
  }

  const fetchAllBranches = async () => {
    const res = await authenticatedApi('branch/all')

    if (res.status == 200) {
      branches.value = res.data.branches
    }

    return branches.value
  }

  const getBranches = async () => {
    return branches.value.length ? branches.value : await fetchAllBranches()
  }

  // branches methods
  const createBranch = async (model) => {
    const res = await authenticatedApi('branch/register', Method.POST, model)
    return res.status < 400
  }

  const updateBranch = async (id, model) => {
    const res = await authenticatedApi(
      `branch/update/${id}`,
      Method.POST,
      model
    )
    return res.status < 400
  }

  return {
    accounts,
    branches,
    productCategories,
    productReorderingPoints,
    getBranches,
    createBranch,
    updateBranch,
    categoryOption,
    getAccounts,
    fetchAllAccounts,
    fetchAllBranches,
    getReorderingPoints,
    getProductCategories,
    fetchAllProductCategories,
    getProductCategoryByIdSync,
    getProductCategoryByIdAsync,
    fetchAllProductReorderingPoints
  }
})
