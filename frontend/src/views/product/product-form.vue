<template>
  <div class="cont">
    <form @submit.prevent class="flex flex-col gap-3">
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
            <CustomInput
              type="number"
              name="cost"
              class="flex-1"
              :has-label="true"
              label="Cost Price"
              :error-has-text="true"
              placeholder="Cost Price"
              :error="modelErrors.cost"
              v-model="model.details.cost"
            />
            <CustomInput
              name="sale"
              type="number"
              class="flex-1"
              :has-label="true"
              label="Sale Price"
              v-model="model.price"
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
              v-model="model.purchase_description"
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
              v-model="model.sale_description"
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
    </form>
  </div>
</template>

<script setup>
import Event from '@/event'
import { computed, onMounted, ref } from 'vue'
import { EventEnum } from '@/data/event'
import CustomInput from '@/components/shared/CustomInput.vue'
import { AccountTypes, ProductType } from 'shared'
import { useSettingsStore } from '@/stores/settings'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import SupplierSelectRow from '@/components/product/SupplierSelectRow.vue'
import SupplierSelectHeader from '@/components/product/SupplierSelectHeader.vue'
import { useProductStore } from '@/stores/product'

const settingStore = useSettingsStore()
const productStore = useProductStore()

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
    status: '',
    cost: '',
    product_setting_id: '',
    product_id: ''
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

onMounted(async () => {
  await settingStore.getAccounts()
  await settingStore.getProductCategories()

  model.value.details.item_code = await productStore.getProductItemCode()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
