<template>
  <div class="cont">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Basic Informations</p>
        <div class="flex flex-col gap-2">
          <CustomInput
            type="text"
            name="product_name"
            placeholder="*Name"
            v-model="model.product.name"
            :error="modelErrors.name"
            :error-has-text="true"
            label="Name"
            :has-label="true"
          />
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
              :error="modelErrors.categories"
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
              v-model="model.details.product_setting_id"
            />
          </div>
          <div class="flex gap-3">
            <CustomInput
              type="select"
              class="flex-1"
              :has-add-new="true"
              name="income_account"
              :options="incomeAccounts"
              v-model="model.product.income_account"
              @add-new="showAccountModal = true"
              placeholder="*Select Income Account"
              label="Income Account"
              :has-label="true"
              :error="modelErrors.income_account"
              :error-has-text="true"
            />
            <CustomInput
              type="select"
              class="flex-1"
              :has-add-new="true"
              name="expense_account"
              :options="expenseAccounts"
              v-model="model.product.expense_account"
              @add-new="showAccountModal = true"
              placeholder="*Select Expense Account"
              label="Expense Account"
              :has-label="true"
              :error="modelErrors.expense_account"
              :error-has-text="true"
            />
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <p class="text-base font-semibold">Inventory and Sales information</p>
          <div class="flex gap-3">
            <div class="flex flex-col gap-2 flex-1">
              <CustomInput
                type="number"
                name="cost"
                :has-label="true"
                label="Cost Price"
                :error-has-text="true"
                placeholder="Cost Price"
                :error="modelErrors.cost"
                v-model="model.details.cost"
                :disabled="!isManuallySetCost"
                input-class="disabled:bg-gray-50 disabled:ring-1 disabled:ring-gray-200"
              />
              <CustomInput
                type="checkbox"
                name="manually_set_cost"
                label="Manually set cost"
                :has-label="true"
                v-model="isManuallySetCost"
                class="[&>div]:flex-row-reverse [&>div]:justify-end"
              />
            </div>
            <CustomInput
              name="sale"
              type="number"
              class="flex-1"
              :has-label="true"
              label="Sale Price"
              v-model="model.product.price"
              :error-has-text="true"
              placeholder="Sale Price"
              :error="modelErrors.price"
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
              placeholder="Quantity in stock"
              :error="modelErrors.quantity_in_stock"
            />
            <CustomInput
              type="text"
              class="flex-1"
              name="item_code"
              label="Item Code"
              :has-label="true"
              :error-has-text="true"
              placeholder="Item Code"
              :error="modelErrors.item_code"
              v-model="model.details.item_code"
            />
          </div>
          <div class="flex gap-3 items-start">
            <CustomInput
              :rows="5"
              class="flex-1"
              type="textarea"
              :has-label="true"
              :error-has-text="true"
              name="purchase_description"
              label="Purchase Description"
              placeholder="Purchase Description"
              v-model="model.details.purchase_description"
              :error="modelErrors.purchase_description"
            />
            <CustomInput
              :rows="5"
              class="flex-1"
              type="textarea"
              :has-label="true"
              name="sale_description"
              label="Sales Description"
              placeholder="Sales Description"
              v-model="model.details.sales_description"
              :error="modelErrors.sale_description"
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
            :format="productSupplier"
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
      model.categories.length ? model.categories[model.categories - 1] : ''
    "
  />
  <AccountModal v-model="showAccountModal" v-if="showAccountModal" />
  <DeleteConfirmModal
    :href="`items/delete/${route.query.id}`"
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
import { AccountTypes, ObjectHelpers, ProductStatus, ProductType } from 'shared'
import { useSettingsStore } from '@/stores/settings'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import AccountModal from '@/components/Settings/AccountModal.vue'
import ProductCategoryModal from '@/components/Settings/ProductCategoryModal.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import SupplierSelectRow from '@/components/product/SupplierSelectRow.vue'
import SupplierSelectHeader from '@/components/product/SupplierSelectHeader.vue'
import { useProductStore } from '@/stores/product'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()
const settingStore = useSettingsStore()
const productStore = useProductStore()

const showAccountModal = ref(false)
const showCategoryModal = ref(false)
const isManuallySetCost = ref(false)
const showConfirmationModal = ref(false)

Event.emit(EventEnum.IS_PAGE_LOADING, true)

const productSupplier = {
  supplier_id: '',
  cost: 0
}

const model = ref({
  product: {
    name: '',
    price: '',
    type: ProductType.INVENTORY,
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
    product_setting_id: ''
  },
  suppliers: [{ ...productSupplier }],
  categories: []
})

const modelErrors = ref({})

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
  Event.emit(EventEnum.IS_PAGE_LOADING, true)
  const data = { ...model.value }
  if (!data.details.product_setting_id) {
    data.details.product_setting_id = null
  }
  let isSuccess = false

  if (route.query.id) {
    isSuccess = await productStore.updateProduct(route.query.id, data)
  } else {
    isSuccess = await productStore.registerProduct(data)
  }

  // TODO: Add toast here
  // If success redirect back to the product list

  // temporary redirect back if success is true
  Event.emit(EventEnum.IS_PAGE_LOADING, false)

  if (isSuccess) {
    router.push({
      name: 'products'
    })
  }
}

const onAfterDelete = async () => {
  await productStore.removeProduct(route.query.id)
  router.push({ name: 'products' })
}

const onCancel = () => router.push({ name: 'products' })

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

      model.value.categories = product.categories.map((cat) => cat.id)
      model.value.suppliers = product.suppliers.map((supplier) => {
        return {
          supplier_id: supplier.id,
          cost: supplier.ProductSupplier.cost
        }
      })
    }
  }

  model.value.details.item_code = await productStore.getProductItemCode()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

/** ================================================
 * WATCHERS
 ** ================================================*/
watch(
  () => model.value.suppliers,
  () => {
    model.value.details.cost = Math.max(
      ...model.value.suppliers.map((sup) => sup.cost)
    )
  },
  {
    deep: true
  }
)
</script>
