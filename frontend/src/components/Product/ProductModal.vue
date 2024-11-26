<template>
  <ModalWrapper
    :title="title"
    v-model="showModal"
    @submit="onSubmit"
    :has-delete="true"
    @delete="showDeleteConfirmModal = true"
  >
    <div class="flex flex-col gap-6 my-7">
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Product Type & Reordering Point</p>
        <div class="flex gap-3">
          <CustomInput
            type="select"
            name="type"
            v-model="model.type"
            class="flex-1"
            placeholder="Select Type"
            label="Type"
            :has-label="true"
            :options="[
              { text: 'inventory', value: ProductType.INVENTORY },
              { text: 'non-inventory', value: ProductType.NON_INVENTORY }
            ]"
            :error="modelErrors.type"
            :error-has-text="true"
          />
          <CustomInput
            type="select"
            class="flex-1"
            :has-label="true"
            name="reordering"
            :has-add-new="true"
            label="Reordering Point"
            :options="reorderingPointOptions"
            v-model="model.product_setting_id"
            placeholder="*Select Reordering Point"
            @add-new="showProductPointModal = true"
            :error="modelErrors.product_setting_id"
            :error-has-text="true"
          />
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Basic Info</p>
        <div class="flex flex-col gap-4">
          <div class="flex gap-3">
            <CustomInput
              type="text"
              name="product_name"
              class="flex-1"
              placeholder="*Name"
              v-model="model.name"
              :error="modelErrors.name"
              :error-has-text="true"
              label="Name"
              :has-label="true"
            />
            <CustomInput
              type="text"
              name="brand"
              class="flex-1"
              placeholder="*Brand"
              v-model="model.brand"
              label="Brand"
              :has-label="true"
              :error="modelErrors.brand"
              :error-has-text="true"
            />
          </div>
          <div class="flex gap-3 items-start">
            <CustomInput
              type="select"
              class="flex-1"
              name="suppliers"
              :has-add-new="true"
              :select-multiple="true"
              v-model="model.suppliers"
              :options="supplierOptions"
              placeholder="*Select Suppliers"
              @add-new="showVendorModal = true"
              label="Suppliers"
              :has-label="true"
              :error="modelErrors.suppliers"
              :error-has-text="true"
            />
            <CustomInput
              type="select"
              name="category_id"
              placeholder="*Select Category"
              class="flex-1"
              :has-add-new="true"
              :options="categoriesOptions"
              @add-new="showCategoryModal = true"
              v-model="model.category_id"
              label="Category"
              :has-label="true"
              :error="modelErrors.category_id"
              :error-has-text="true"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Inventory and Sales info</p>
        <div class="flex flex-col gap-4">
          <div class="flex gap-3">
            <CustomInput
              type="number"
              name="cost"
              class="flex-1"
              placeholder="Cost Price"
              v-model="model.cost"
              label="Cost Price"
              :has-label="true"
              :error="modelErrors.cost"
              :error-has-text="true"
            />
            <CustomInput
              name="sale"
              type="number"
              class="flex-1"
              placeholder="Sale Price"
              v-model="model.price"
              label="Sale Price"
              :has-label="true"
              :error="modelErrors.price"
              :error-has-text="true"
            />
          </div>
          <div class="flex gap-3 items-start">
            <CustomInput
              type="select"
              class="flex-1"
              :has-add-new="true"
              name="income_account"
              :options="incomeAccounts"
              v-model="model.income_account"
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
              v-model="model.expense_account"
              @add-new="showAccountModal = true"
              placeholder="*Select Expense Account"
              label="Expense Account"
              :has-label="true"
              :error="modelErrors.expense_account"
              :error-has-text="true"
            />
          </div>
          <div class="flex gap-3">
            <CustomInput
              type="number"
              class="flex-1"
              name="quantity_in_stock"
              placeholder="Quantity in stock"
              v-model="model.quantity_in_stock"
              label="Quantity in stock"
              :has-label="true"
              :error="modelErrors.quantity_in_stock"
              :error-has-text="true"
            />
            <CustomInput
              type="text"
              class="flex-1"
              name="item_code"
              placeholder="Item Code"
              v-model="model.item_code"
              label="Item Code"
              :has-label="true"
              :error="modelErrors.item_code"
              :error-has-text="true"
            />
          </div>
          <div class="flex gap-3 items-start">
            <CustomInput
              :rows="5"
              class="flex-1"
              type="textarea"
              name="purchase_description"
              placeholder="Purchase Description"
              v-model="model.purchase_description"
              label="Purchase Description"
              :has-label="true"
              :error="modelErrors.purchase_description"
              :error-has-text="true"
            />
            <CustomInput
              :rows="5"
              class="flex-1"
              type="textarea"
              name="sale_description"
              placeholder="Sales Description"
              v-model="model.sale_description"
              label="Sales Description"
              :has-label="true"
              :error="modelErrors.sale_description"
              :error-has-text="true"
            />
          </div>
        </div>
      </div>
    </div>
  </ModalWrapper>
  <VendorModal v-if="showVendorModal" v-model="showVendorModal" />
  <AccountModal v-if="showAccountModal" v-model="showAccountModal" />
  <ProductCategoryModal v-if="showCategoryModal" v-model="showCategoryModal" />
  <ProductPointModal
    v-if="showProductPointModal"
    v-model="showProductPointModal"
  />
  <DeleteConfirmModal
    v-if="showDeleteConfirmModal"
    v-model="showDeleteConfirmModal"
    :href="`products/delete/${props.selectedId}`"
    @after-delete="onAfterDelete"
  />
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import { Method, authenticatedApi } from '@/api'
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import DeleteConfirmModal from '../DeleteConfirmModal.vue'
import ProductCategoryModal from '@/components/Settings/ProductCategoryModal.vue'
import AccountModal from '@/components/Settings/AccountModal.vue'
import VendorModal from '@/components/Vendor/VendorModal.vue'
import ProductPointModal from '@/components/Settings/ProductPointModal.vue'
import { computed, onMounted, ref } from 'vue'
import { AccountTypes, ProductType } from 'shared'
import { ProductSchema } from 'shared/validators/product'

import { useVendorStore } from '@/stores/supplier'
import { useSettingsStore } from '@/stores/settings'
import { useProductStore } from '@/stores/product'

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const emit = defineEmits(['newAccount'])

const showModal = defineModel()
const showVendorModal = ref(false)
const showAccountModal = ref(false)
const showCategoryModal = ref(false)
const showProductPointModal = ref(false)
const showDeleteConfirmModal = ref(false)

const model = ref({
  name: '',
  purchase_description: '',
  sale_description: '',
  cost: '',
  price: '',
  item_code: '',
  brand: '',
  quantity_in_stock: '',
  status: '',
  type: '',
  category_id: '',
  suppliers: [],
  income_account: '',
  expense_account: '',
  product_setting_id: ''
})

const modelErrors = ref({})

const title = ref(props.selectedId ? 'Edit Product' : 'New Product')
const apiPath = ref(props.selectedId ? 'products/update' : 'products/register')

const supplierStore = useVendorStore()
const settingStore = useSettingsStore()
const productStore = useProductStore()

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

const supplierOptions = computed(() => {
  return supplierStore.suppliers.map((supplier) => {
    return {
      value: supplier.id,
      text: supplier.company_name
    }
  })
})

const categoriesOptions = computed(() => {
  return settingStore.productCategories.map((category) => {
    return {
      value: category.id,
      text: category.name
    }
  })
})

const reorderingPointOptions = computed(() => {
  const opts = [
    {
      text: 'None',
      value: null
    },
    ...settingStore.productReorderingPoints.map((point) => {
      return {
        value: point.id,
        text: point.point
      }
    })
  ]
  return opts
})

const generateItemCode = async () => {
  const res = await authenticatedApi('products/item-code')
  if (res.status == 200) {
    model.value.item_code = res.data.item_code
  }
}

onMounted(async () => {
  await supplierStore.fetchAllSuppliers()
  await settingStore.fetchAllProductCategories()
  await settingStore.fetchAllAccounts()
  await settingStore.fetchAllProductReorderingPoints()

  if (props.selectedId) {
    model.value = (() => {
      let product = productStore.products.find(
        (product) => product.id == props.selectedId
      )

      // remove pass by reference
      product = { ...product }

      if (product) {
        if (product.suppliers.length) {
          product.cost = product.suppliers[0].ProductSupplier.cost
          product.suppliers = product.suppliers.map((supplier) => supplier.id)
        }

        product.expense_account = product.expense.id
        product.income_account = product.income.id
      }

      return product ? product : model.value
    })()
  }

  if (!props.selectedId) {
    await generateItemCode()
  }
})

const onAfterDelete = async () => {
  showModal.value = false
  await productStore.fetchAllProducts()
}

const onSubmit = async () => {
  // validation
  const { error } = ProductSchema.validate(model.value, { abortEarly: false })

  if (error) {
    error.details.forEach((err) => {
      modelErrors.value[err.context.key] = err.message
    })
    return
  }

  await authenticatedApi(apiPath.value, Method.POST, model.value)
  await productStore.fetchAllProducts()
  showModal.value = false
}
</script>
