<template>
  <ProductModal
    v-model="showModal"
    v-if="showModal"
    :selected-id="selectedId"
  />

  <div class="w-[calc(100vw_-_328px)] flex gap-4 max-[1620px]:flex-col-reverse">
    <CustomTable
      @view="onView"
      class="w-full"
      :has-filter="true"
      :has-add-btn="true"
      :data="filteredData"
      :has-pagination="true"
      @add-new-record="onNewRecord"
      v-model:search-text="searchText"
      :row-prop-init="productRowEvent"
      :table-row-component="ProductRow"
    >
      <template #table_header>
        <div class="grid grid-cols-9 gap-3 w-full min-w-[907px]">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-3 table-header">Item Description</p>
          <p class="col-span-1 table-header">Item Code</p>
          <p class="col-span-1 table-header text-end">Price</p>
          <p class="col-span-1 table-header text-end pr-2">Stock</p>
          <p class="col-span-1 table-header">Added on</p>
          <p class="col-span-1 table-header">Status</p>
        </div>
      </template>

      <!-- filter contents -->
      <template v-slot:filters>
        <div class="flex flex-col gap-3 mt-3">
          <CustomInput
            type="select"
            name="Category"
            :has-label="true"
            label="Select Category"
            v-model="filters.category"
            :options="categoryOptions"
            placeholder="Select Category"
            @reset="filters.category = null"
          />
          <div>
            <small>Added on</small>
            <div class="flex gap-3">
              <CustomInput
                type="date"
                name="date_from"
                placeholder="From"
                v-model="filters.added_on_from"
                @reset="filters.added_on_from = ''"
                input-class="min-w-[200px] max-h-[38px]"
              />
              <CustomInput
                type="date"
                name="date_to"
                placeholder="To"
                v-model="filters.added_on_to"
                @reset="filters.added_on_to = ''"
                input-class="min-w-[200px] max-h-[38px]"
              />
            </div>
          </div>
          <div>
            <small>Stocks</small>
            <div class="flex gap-3">
              <CustomInput
                name="from"
                label="From"
                type="number"
                :has-label="true"
                placeholder="From"
                v-model="filters.stock_from"
                @reset="filters.stock_from = null"
              />
              <CustomInput
                name="to"
                label="From"
                type="number"
                :has-label="true"
                placeholder="To"
                v-model="filters.stock_to"
                @reset="filters.stock_to = null"
              />
            </div>
          </div>
        </div>
      </template>
    </CustomTable>
    <ProductNotification />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ProductModal from '@/components/product/ProductModal.vue'
import ProductNotification from '@/components/Notification/ProductNotification.vue'
import ProductRow from '@/components/product/ProductRow.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import { useProductStore } from '@/stores/product'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { DateHelpers } from 'shared'
import { useSettingsStore } from '@/stores/settings'
import router from '@/router'
import { InventoryConst } from '@/const/route.constants'

const selectedId = ref(0)
const searchText = ref('')
const showModal = ref(false)
const categoryOptions = ref([])
const filters = ref({
  added_on_from: '',
  added_on_to: '',
  stock_from: null,
  stock_to: null,
  category: ''
})

const productStore = useProductStore()
const settingStore = useSettingsStore()

/** ================================================
 * EVENTS
 ** ================================================*/

Event.emit(EventEnum.IS_PAGE_LOADING, true)

// define product row props
const productRowEvent = 'product-row-init-props'
Event.on(productRowEvent, function (data) {
  return { product: data }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return productStore.products
    .filter((product) => {
      const catId =
        filters.value.category === '' ? null : filters.value.category

      return catId ? product.category_id == catId : product
    })
    .filter((product) => {
      filters.value.stock_from =
        filters.value.stock_from === '' ? null : filters.value.stock_from

      filters.value.stock_to =
        filters.value.stock_to === '' ? null : filters.value.stock_to

      if (
        filters.value.stock_from !== null &&
        filters.value.stock_to !== null
      ) {
        return (
          product.quantity_in_stock >= filters.value.stock_from &&
          product.quantity_in_stock <= filters.value.stock_to
        )
      } else if (
        filters.value.stock_from !== null &&
        filters.value.stock_to == null
      ) {
        return product.quantity_in_stock >= filters.value.stock_from
      } else if (
        filters.value.stock_from == null &&
        filters.value.stock_to !== null
      ) {
        return product.quantity_in_stock <= filters.value.stock_to
      } else {
        return product
      }
    })
    .filter((product) =>
      DateHelpers.getRangeDates(
        filters.value.added_on_from,
        filters.value.added_on_to,
        product.createdAt
      )
    )
    .filter((product) => {
      const searchCondition =
        `${product.id} ${product.item_code} ${product.purchase_description} ${product.quantity_in_stock} ${DateHelpers.formatDate(product.createdAt, 'M/D/YYYY')}`.toLowerCase()
      return searchText.value
        ? searchCondition.includes(searchText.value.toLowerCase())
        : product
    })
})

/** ================================================
 * METHODS
 ** ================================================*/
const onNewRecord = () => {
  router.push({
    name: InventoryConst.PRODUCT_FORM
  })
}

const onView = (id) => {
  router.push({
    name: InventoryConst.PRODUCT_FORM,
    query: { id }
  })
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await productStore.getProducts()
  categoryOptions.value = await settingStore.categoryOption()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
