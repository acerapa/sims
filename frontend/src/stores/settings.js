import { authenticatedApi, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const productCategories = ref([])
  const accounts = ref([])
  const branches = ref([])
  const productReorderingPoints = ref([])

  /*
   * PRODUCT REORDERING POINTS METHODS START
   */
  const regulateProductReordering = (pointReordering) => {
    const newPointProducts = pointReordering.product_details.map(
      (pd) => pd.product.id
    )

    productReorderingPoints.value.forEach((prp) => {
      newPointProducts.forEach((pointProduct) => {
        if (prp.product_details.length) {
          if (
            prp.product_details
              .map((pd) => pd.product.id)
              .includes(pointProduct)
          ) {
            const index = prp.product_details.findIndex(
              (pd) => pd.product.id == pointProduct
            )
            if (index > -1) {
              prp.product_details.splice(index, 1)
            }
          }
        }
      })
    })
  }

  const fetchAllProductReorderingPoints = async () => {
    const res = await authenticatedApi('product-setting/all')
    if (res.status == 200) {
      productReorderingPoints.value = res.data.productReorderingPoints
    }

    return res.data.productReorderingPoints
  }

  const getReorderingPoints = async () => {
    if (!productReorderingPoints.value.length) {
      await fetchAllProductReorderingPoints()
    }

    return productReorderingPoints.value
  }

  const registerReorderingPoint = async (model) => {
    const res = await authenticatedApi(
      'product-setting/register',
      Method.POST,
      model
    )

    const isSuccess = res.status < 400
    if (isSuccess) {
      if (productReorderingPoints.value.length) {
        regulateProductReordering(res.data.point)

        productReorderingPoints.value.unshift(res.data.point)
      } else {
        await fetchAllProductCategories()
      }
    }

    return isSuccess
  }

  const updateReorderingPoint = async (id, model) => {
    const res = await authenticatedApi(
      `product-setting/${id}`,
      Method.PUT,
      model
    )
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (productReorderingPoints.value.length) {
        regulateProductReordering(res.data.point)

        const index = productReorderingPoints.value.findIndex(
          (prp) => prp.id == id
        )
        if (index > -1) {
          productReorderingPoints.value[index] = res.data.point
        }
      } else {
        await fetchAllProductReorderingPoints()
      }
    }

    return isSuccess
  }

  /*
   * PRODUCT REORDERING POINTS METHODS END
   */

  /*
   * PRODUCT CATEGORIES METHODS START
   */
  const fetchAllProductCategories = async () => {
    const res = await authenticatedApi('product-category/all')
    if (res.status == 200) {
      productCategories.value = res.data.categories
    }

    return res.data.categories
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

  const registerProductCategory = async (model) => {
    const res = await authenticatedApi(
      'product-category/register',
      Method.POST,
      model
    )

    const isSuccess = res.status < 400
    if (isSuccess) {
      if (productCategories.value.length) {
        productCategories.value.unshift(res.data.category)
      } else {
        await fetchAllProductCategories()
      }
    }

    return isSuccess
  }

  const updateProductCategory = async (id, model) => {
    const res = await authenticatedApi(
      `product-category/${id}`,
      Method.PUT,
      model
    )
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (productCategories.value.length) {
        const index = productCategories.value.findIndex((pc) => pc.id == id)
        if (index > -1) {
          productCategories.value[index] = res.data.category
        }
      } else {
        await fetchAllProductCategories()
      }
    }

    return isSuccess
  }

  const removeProductCategory = async (id) => {
    if (productCategories.value.length) {
      const index = productCategories.value.findIndex((pc) => pc.id == id)
      if (index > -1) {
        productCategories.value.splice(index, 1)
      }
    } else {
      await fetchAllProductCategories()
    }
  }

  /*
   * PRODUCT CATEGORIES METHODS END
   */

  /*
   * ACCOUNTS METHODS START
   */
  const getAccounts = async () => {
    if (!accounts.value.length) {
      await fetchAllAccounts()
    }

    return accounts.value
  }

  const fetchAllAccounts = async () => {
    const res = await authenticatedApi('settings/accounts/all')
    if (res.status == 200) {
      accounts.value = res.data.accounts
    }
    return res.data.accounts
  }

  const createAccount = async (data) => {
    const res = await authenticatedApi(
      'settings/accounts/register',
      Method.POST,
      data
    )
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (accounts.value.length) {
        accounts.value.unshift(res.data.account)
      } else {
        await fetchAllAccounts()
      }
    }

    return isSuccess
  }

  const updateAccount = async (id, data) => {
    const res = await authenticatedApi(
      `settings/accounts/${id}`,
      Method.PUT,
      data
    )
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (accounts.value.length) {
        const index = accounts.value.findIndex((account) => account.id == id)
        accounts.value[index] = res.data.account
      } else {
        await fetchAllAccounts()
      }
    }

    return isSuccess
  }

  const removeAccount = async (id) => {
    if (accounts.value.length) {
      const index = accounts.value.findIndex((a) => a.id == id)
      if (index > -1) {
        accounts.value.splice(index, 1)
      }
    }
  }
  /*
   * ACCOUNTS METHODS END
   */

  /*
   * BRANCHES METHODS START
   */
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

  const createBranch = async (model) => {
    const res = await authenticatedApi('branch/register', Method.POST, model)
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (!branches.value.length) {
        await fetchAllBranches()
      } else {
        branches.value.unshift(res.data.branch)
      }
    }

    return res.status < 400
  }

  const updateBranch = async (id, model) => {
    const res = await authenticatedApi(
      `branch/update/${id}`,
      Method.POST,
      model
    )

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (!branches.value.length) {
        await fetchAllBranches()
      } else {
        let index = branches.value.findIndex((branch) => branch.id == id)
        branches.value[index] = res.data.branch
      }
    }

    return res.status < 400
  }

  const removeBranch = async (id) => {
    if (!branches.value.length) {
      await fetchAllBranches()
    } else {
      let index = branches.value.findIndex((b) => b.id == id)
      if (index > -1) {
        branches.value.splice(index, 1)
      }
    }
  }

  /*
   * BRANCHES METHODS END
   */

  return {
    accounts,
    branches,
    productCategories,
    productReorderingPoints,

    getBranches,
    getAccounts,
    updateBranch,
    createBranch,
    removeBranch,
    createAccount,
    updateAccount,
    removeAccount,
    categoryOption,
    fetchAllBranches,
    fetchAllAccounts,
    getReorderingPoints,
    getProductCategories,
    updateProductCategory,
    removeProductCategory,
    updateReorderingPoint,
    registerProductCategory,
    registerReorderingPoint,
    fetchAllProductCategories,
    getProductCategoryByIdSync,
    getProductCategoryByIdAsync,
    fetchAllProductReorderingPoints
  }
})
