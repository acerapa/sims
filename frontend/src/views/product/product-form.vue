<template>
  <div class="cont">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Basic Informations</p>
        <div class="flex flex-col gap-3">
          <div class="flex gap-3">
            <CustomInput
              type="select"
              name="categories"
              placeholder="*Select Categories"
              class="flex-1"
              :can-search="true"
              :has-add-new="true"
              :select-multiple="true"
              :options="categoriesOptions"
              @add-new="showCategoryModal = true"
              v-model="model.categories"
              label="Categories"
              :has-label="true"
              :error="errors.categories"
              :error-has-text="true"
            />
            <CustomInput
              type="select"
              class="flex-1"
              name="reordering"
              :has-label="true"
              :has-add-new="true"
              label="Reordering Point"
              :options="reorderingPointsOptions"
              placeholder="Select re-ordering point"
              @add-new="showProductPointModal = true"
              v-model="model.details.product_setting_id"
            />
          </div>
          <div class="flex gap-3">
            <CustomInput
              type="select"
              class="flex-1"
              :has-label="true"
              :has-add-new="true"
              name="income_account"
              :error-has-text="true"
              label="Income Account"
              :options="incomeAccounts"
              @add-new="showAccountModal = true"
              placeholder="*Select Income Account"
              v-model="model.product.income_account"
              :error="errors.product?.income_account"
            />
            <CustomInput
              type="select"
              class="flex-1"
              :has-label="true"
              :has-add-new="true"
              name="expense_account"
              :error-has-text="true"
              label="Expense Account"
              :options="expenseAccounts"
              @add-new="showAccountModal = true"
              placeholder="*Select Expense Account"
              v-model="model.product.expense_account"
              :error="errors.product?.expense_account"
            />
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <p class="text-base font-semibold">Inventory and Sales information</p>
          <div class="flex gap-3">
            <div class="flex flex-col gap-5 flex-1">
              <CustomInput
                type="number"
                name="cost"
                :has-label="true"
                label="Cost Price"
                :error-has-text="true"
                placeholder="Cost Price"
                v-model="model.details.cost"
                :error="errors.details?.cost"
                :disabled="!model.details.is_manually_set_cost"
                input-class="disabled:bg-gray-50 disabled:ring-1 disabled:ring-gray-200"
              />
              <CustomInput
                type="checkbox"
                name="manually_set_cost"
                label="Manually set cost"
                :has-label="true"
                v-model="model.details.is_manually_set_cost"
                class="[&>div]:flex-row-reverse [&>div]:justify-end"
              />
            </div>
            <CustomInput
              name="sale"
              type="number"
              class="flex-1"
              :has-label="true"
              label="Sale Price"
              :error-has-text="true"
              placeholder="Sale Price"
              v-model="model.product.price"
              :error="errors.product?.price"
            />
          </div>
          <div class="flex gap-3">
            <CustomInput
              type="number"
              class="flex-1"
              :has-label="true"
              :error-has-text="true"
              name="quantity_in_stock"
              label="Quantity in stock"
              v-model="model.details.stock"
              :error="errors.details?.stock"
              placeholder="Quantity in stock"
            />
            <CustomInput
              type="text"
              class="flex-1"
              name="item_code"
              label="Item Code"
              :has-label="true"
              :error-has-text="true"
              placeholder="Item Code"
              v-model="model.details.item_code"
              :error="errors.details?.item_code"
            />
          </div>
          <CustomInput
            type="checkbox"
            :has-label="true"
            v-model="isSameDescription"
            name="is-the-same-description"
            label="The same description?"
            class="[&>div]:flex-row-reverse [&>div]:justify-end"
          />
          <div class="flex gap-3 items-end">
            <CustomInput
              :rows="5"
              class="flex-1"
              type="textarea"
              :has-label="true"
              :error-has-text="true"
              name="purchase_description"
              label="Purchase Description"
              placeholder="*Purchase Description"
              @input="onInputPurchaseDescription"
              v-model="model.details.purchase_description"
              :error="errors.details?.purchase_description"
            />

            <CustomInput
              :rows="5"
              class="flex-1"
              type="textarea"
              :has-label="true"
              name="sale_description"
              label="Sales Description"
              placeholder="*Sales Description"
              @input="onInputSalesDescription"
              v-model="model.details.sales_description"
              :error="errors.details?.sales_description"
              :error-has-text="true"
            />
          </div>
        </div>
        <div class="flex flex-col gap-3 mt-4">
          <div class="flex justify-Eetween items-center">
            <p class="text-base font-semibold">Suppliers</p>
          </div>
          <MultiSelectTable
            :header-component="SupplierSelectHeader"
            :row-component="SupplierSelectRow"
            :row-event-name="rowEventName"
            :format="productSupplier"
            :row-props="{
              preSelectedSups: preselectedSupplier,
              selected: model.suppliers
            }"
            v-model="model.suppliers"
          />
        </div>
      </div>

      <div class="flex gap-3 mt-4">
        <div class="flex-1">
          <button
            type="button"
            v-if="route.query.id"
            class="btn-danger-outline"
            @click="showConfirmationModal = true"
          >
            Delete
          </button>
        </div>
        <button type="button" class="btn-gray-outline" @click="onCancel">
          Cancel
        </button>
        <button type="submit" class="btn">Save</button>
      </div>
    </form>
  </div>
  <ProductCategoryModal
    v-model="showCategoryModal"
    v-if="showCategoryModal"
    :general_cat="
      model.categories.length
        ? model.categories[model.categories.length - 1]
        : ''
    "
  />
  <AccountModal v-model="showAccountModal" v-if="showAccountModal" />
  <ProductPointModal
    v-model="showProductPointModal"
    v-if="showProductPointModal"
  />
  <DeleteConfirmModal
    :href="`products/${route.query.id}`"
    v-model="showConfirmationModal"
    v-if="showConfirmationModal"
    @after-delete="onAfterDelete"
  />
</template>

<script setup>
import Event from '@/event'
import { computed, onMounted, ref, watch } from 'vue'
import { EventEnum } from '@/data/event'
import CustomInput from '@/components/shared/CustomInput.vue'
import {
  AccountTypes,
  ItemType,
  ObjectHelpers,
  ProductItemSchema,
  ProductStatus
} from 'shared'
import { useSettingsStore } from '@/stores/settings'

import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import AccountModal from '@/components/Settings/AccountModal.vue'
import ProductCategoryModal from '@/components/Settings/ProductCategoryModal.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import SupplierSelectRow from '@/components/product/SupplierSelectRow.vue'
import SupplierSelectHeader from '@/components/product/SupplierSelectHeader.vue'
import ProductPointModal from '@/components/Settings/ProductPointModal.vue'

import { useProductStore } from '@/stores/product'
import { useRoute } from 'vue-router'
import router from '@/router'
import { ToastTypes } from '@/data/types'
import { InventoryConst } from '@/const/route.constants'
import { useValidation } from '@/composables/useValidation'
import { useAppStore } from '@/stores/app'
import { PageStateConst } from '@/const/state.constants'

// injections and stores
const route = useRoute()
const appStore = useAppStore()
const settingStore = useSettingsStore()
const productStore = useProductStore()

// flags
const showAccountModal = ref(false)
const isSameDescription = ref(false)
const showCategoryModal = ref(false)
const showProductPointModal = ref(false)
const showConfirmationModal = ref(false)

const productSupplier = {
  supplier_id: '',
  cost: 0
}

const model = ref({
  product: {
    price: '',
    type: ItemType.INVENTORY,
    income_account: '',
    expense_account: ''
  },
  details: {
    purchase_description: '',
    sales_description: '',
    item_code: '',
    stock: '',
    status: ProductStatus.ACTIVE,
    cost: '',
    is_manually_set_cost: false,
    product_setting_id: ''
  },
  suppliers: [{ ...productSupplier }],
  categories: []
})

const preselectedSupplier = ref([])

// composables
const { errors, validateData, hasErrors } = useValidation(
  ProductItemSchema,
  model.value
)

/** ================================================
 * EVENTS
 ** ================================================*/
const rowEventName = 'product-supplier-row-event'
Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/
const incomeAccounts = computed(() => {
  return settingStore.accounts
    .filter((acc) => acc.type == AccountTypes.INCOME)
    .map((acc) => {
      return {
        text: acc.name,
        value: acc.id
      }
    })
})

const expenseAccounts = computed(() => {
  return settingStore.accounts
    .filter((acc) => acc.type == AccountTypes.EXPENSE)
    .map((acc) => {
      return {
        text: acc.name,
        value: acc.id
      }
    })
})

const categoriesOptions = computed(() => {
  return settingStore.productCategories.map((category) => {
    let isHidden = false

    if (model.value.categories.length) {
      isHidden =
        category.general_cat !=
        model.value.categories[model.value.categories.length - 1]
    } else {
      isHidden = category.general_cat ? true : false
    }

    return {
      value: category.id,
      text: category.name,
      hidden: isHidden
    }
  })
})

const reorderingPointsOptions = computed(() => {
  return settingStore.productReorderingPoints.map((point) => {
    return {
      text: point.point,
      value: point.id
    }
  })
})

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async () => {
  const data = { ...model.value }
  if (!data.details.product_setting_id) {
    data.details.product_setting_id = null
  }

  // validate data
  validateData()

  if (hasErrors.value) {
    Event.emit(rowEventName, errors.value.suppliers)
    return
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, true)
  let isSuccess = false

  if (route.query.id) {
    isSuccess = await productStore.updateProduct(route.query.id, data)
  } else {
    isSuccess = await productStore.registerProduct(data)
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)

  if (isSuccess) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Product ${route.query.id ? 'updated' : 'created'} successfully!`,
      type: ToastTypes.SUCCESS,
      duration: 2000
    })
    router.push({
      name: route.query.redirect
        ? route.query.redirect
        : InventoryConst.PRODUCTS
    })
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Failed to ${route.query.id ? 'update' : 'create'} product!`,
      type: ToastTypes.ERROR,
      duration: 2000
    })
  }
}

const onAfterDelete = async () => {
  await productStore.removeProduct(route.query.id)
  router.push({ name: InventoryConst.PRODUCTS })
}

const onCancel = () =>
  router.push({
    name: route.query.redirect ? route.query.redirect : InventoryConst.PRODUCTS
  })

const onInputPurchaseDescription = () => {
  if (isSameDescription.value) {
    model.value.details.sales_description =
      model.value.details.purchase_description
  }
}

const onInputSalesDescription = () => {
  if (isSameDescription.value) {
    model.value.details.purchase_description =
      model.value.details.sales_description
  }
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await settingStore.getAccounts()
  await settingStore.getReorderingPoints()
  await settingStore.getProductCategories()

  // check for query params
  if (route.query.id) {
    const product = await productStore.getProduct(route.query.id)
    if (product) {
      model.value.product = ObjectHelpers.assignSameFields(
        model.value.product,
        product
      )
      model.value.details = ObjectHelpers.assignSameFields(
        model.value.details,
        product.product_details
      )

      // product details description flags
      if (
        model.value.details.purchase_description ==
        model.value.details.sales_description
      ) {
        isSameDescription.value = true
      }

      model.value.categories = product.categories.map((cat) => cat.id)
      model.value.suppliers = product.suppliers.map((supplier) => {
        return {
          supplier_id: supplier.id,
          cost: supplier.ProductSupplier.cost
        }
      })
    }
  } else {
    model.value.details.item_code = await productStore.getProductItemCode()

    // for now per-selected supplier only comes from purchase order
    // That said, we'll just check if there's a purchase order form page state
    if (appStore.isPageExist(PageStateConst.PURCHASE_ORDER_FORM)) {
      const pageState = appStore.getPageState(
        PageStateConst.PURCHASE_ORDER_FORM
      )
      const purchaseOrder = pageState.state
      preselectedSupplier.value.push(purchaseOrder.order.supplier_id)

      // set to model manually
      model.value.suppliers = preselectedSupplier.value.map((sup) => {
        return {
          supplier_id: sup,
          cost: 0
        }
      })
    }
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

/** ================================================
 * WATCHERS
 ** ================================================*/
watch(
  () => model.value.suppliers,
  () => {
    if (!model.value.details.is_manually_set_cost) {
      model.value.details.cost = Math.max(
        ...model.value.suppliers.map((sup) => sup.cost)
      )
    }
  },
  {
    deep: true
  }
)

watch(
  () => model.value.details.is_manually_set_cost,
  (val) => {
    if (!val) {
      model.value.details.cost = Math.max(
        ...model.value.suppliers.map((sup) => sup.cost)
      )
    } else {
      if (route.query.id && productStore.product) {
        model.value.details.cost = productStore.product.product_details.cost
      }
    }
  }
)
</script>
