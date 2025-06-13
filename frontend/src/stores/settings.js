import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { ObjectHelpers } from 'shared'
import { ref } from 'vue'

const ProductCategoryAction = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete'
}

export const useSettingsStore = defineStore('settings', () => {
  const productCategories = ref([])
  const accounts = ref([])
  const branches = ref([])
  const productReorderingPoints = ref([])

  /*
   * PRODUCT REORDERING POINTS METHODS START
   */
  const fetchAllProductReorderingPoints = async () => {
    const res = await api('product-setting/all')
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
    const res = await api('product-setting/register', Method.POST, model)

    const isSuccess = res.status < 400
    if (isSuccess) {
      if (productReorderingPoints.value.length) {
        productReorderingPoints.value.unshift(res.data.point)
      } else {
        await fetchAllProductCategories()
      }
    }

    return {
      is_success: isSuccess,
      data: res.data
    }
  }

  const updateReorderingPoint = async (id, model) => {
    const res = await api(`product-setting/${id}`, Method.PUT, model)
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (productReorderingPoints.value.length) {
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

    return {
      is_success: isSuccess,
      data: res.data
    }
  }

  /*
   * PRODUCT REORDERING POINTS METHODS END
   */

  /*
   * PRODUCT CATEGORIES METHODS START
   */
  const fetchAllProductCategories = async () => {
    const res = await api('product-category/all')
    if (res.status == 200) {
      productCategories.value = res.data.categories
    }

    return res.data.categories
  }

  const fetchProductCategory = async (id) => {
    let category = null
    const res = await api(`product-category/${id}`)
    if (res.status < 400) {
      category = res.data.category
    }
    return category
  }

  const getFullCategoryHeirarchy = async (id) => {
    if (!productCategories.value.length) {
      await fetchAllProductCategories()
    }

    // inner function to find category in hierarchy
    const hierarchy = []
    const findAndGatherCategories = (id) => {
      const category = productCategories.value.find((pc) => pc.id == id)
      if (category) {
        hierarchy.unshift(category)
        if (category.general_cat) {
          findAndGatherCategories(category.general_cat)
        }
      }
    }

    // Run the inner funtion
    findAndGatherCategories(id)

    return hierarchy
  }

  const getProductCategories = async () => {
    if (!productCategories.value.length) {
      await fetchAllProductCategories()
    }

    return productCategories.value
  }

  const findCategoryInHierarchy = async (id) => {
    if (!productCategories.value.length) {
      await fetchAllProductCategories()
    }

    // inner function to find category in hierarchy
    const findCategory = (categories, id) => {
      for (const cat of categories) {
        if (cat.id == id) {
          return cat
        } else if (cat.sub_categories) {
          return findCategory(cat.sub_categories, id)
        }
      }
    }

    let category = findCategory(productCategories.value, id)
    if (!category) {
      category = await fetchProductCategory(id)
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
    const res = await api('product-category/register', Method.POST, model)

    const isSuccess = res.status < 400
    if (isSuccess) {
      await handleCategoryAction(
        res.data.category,
        ProductCategoryAction.CREATE
      )
    }

    return isSuccess
  }

  const updateProductCategory = async (id, model) => {
    const res = await api(`product-category/${id}`, Method.PUT, model)
    const isSuccess = res.status < 400

    if (isSuccess) {
      await handleCategoryAction(
        res.data.category,
        ProductCategoryAction.UPDATE
      )
    }

    return isSuccess
  }

  const removeProductCategory = async (category) => {
    await handleCategoryAction(category, ProductCategoryAction.DELETE)
  }

  // private product category methods

  /**
   * Handles actions on product categories, either at the root level or within nested subcategories
   * @param {Object} category - The product category to create, update, or delete
   * @param {ProductCategoryAction} [action=ProductCategoryAction.CREATE] - The type of action to perform on the category
   * @returns {Promise<void>} A promise that resolves when the category action is complete
   */
  const handleCategoryAction = async (
    category,
    action = ProductCategoryAction.CREATE
  ) => {
    if (!productCategories.value.length) {
      await fetchAllProductCategories()
      return
    }

    if (!category.general_cat) {
      switch (action) {
        case ProductCategoryAction.CREATE:
          productCategories.value.unshift(category)
          break
        case ProductCategoryAction.UPDATE:
          const index = productCategories.value.findIndex(
            (pc) => pc.id == category.id
          )
          if (index > -1) {
            productCategories.value[index] = ObjectHelpers.assignSameFields(
              productCategories.value[index],
              category
            )
          }
          break
        case ProductCategoryAction.DELETE:
          productCategories.value = productCategories.value.filter(
            (pc) => pc.id != category.id
          )
          break
      }
    } else {
      applyCategoryAction(productCategories.value, category, action)
    }
  }

  /**
   * Recursively applies an action (create, update, or delete) to a nested category structure
   * @param {Array} categories - The list of categories to search and modify
   * @param {Object} category - The category to be created, updated, or deleted
   * @param {ProductCategoryAction} action - The type of action to perform on the category
   */
  const applyCategoryAction = (categories, category, action) => {
    categories.forEach((cat) => {
      if (cat.id == category.general_cat) {
        switch (action) {
          case ProductCategoryAction.CREATE:
            if (cat.sub_categories) {
              cat.sub_categories = [category, ...cat.sub_categories]
            } else {
              cat.sub_categories = [category]
            }
            break
          case ProductCategoryAction.UPDATE:
            const index = cat.sub_categories.findIndex(
              (sc) => sc.id == category.id
            )
            if (index > -1) {
              cat.sub_categories[index] = ObjectHelpers.assignSameFields(
                cat.sub_categories[index],
                category
              )
            }
            break
          case ProductCategoryAction.DELETE:
            cat.sub_categories = cat.sub_categories.filter(
              (sc) => sc.id != category.id
            )
            break
        }
      } else if (cat.sub_categories) {
        applyCategoryAction(cat.sub_categories, category, action)
      }
    })
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
    const res = await api('settings/accounts/all')
    if (res.status == 200) {
      accounts.value = res.data.accounts
    }
    return res.data.accounts
  }

  const createAccount = async (data) => {
    const res = await api('settings/accounts/register', Method.POST, data)
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
    const res = await api(`settings/accounts/${id}`, Method.PUT, data)
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
    const res = await api('branch/all')

    if (res.status == 200) {
      branches.value = res.data.branches
    }

    return branches.value
  }

  const getBranches = async () => {
    return branches.value.length ? branches.value : await fetchAllBranches()
  }

  const createBranch = async (model) => {
    const res = await api('branch/register', Method.POST, model)
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
    const res = await api(`branch/update/${id}`, Method.POST, model)

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

  const getCurrentBranch = async () => {
    let current = branches.value.find((b) => b.is_current)
    if (!current) {
      const res = await api('branch/current')
      if (res.status < 400) {
        current = res.data.branch
        branches.value.push(current)
      }
    }

    return current
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
    getCurrentBranch,
    getReorderingPoints,
    getProductCategories,
    updateProductCategory,
    removeProductCategory,
    updateReorderingPoint,
    registerProductCategory,
    findCategoryInHierarchy,
    registerReorderingPoint,
    getFullCategoryHeirarchy,
    fetchAllProductCategories,
    fetchAllProductReorderingPoints
  }
})
