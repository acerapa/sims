<template>
  <div>
    <ProductCategoryModal
      v-model="pageState.showCategoyModal"
      v-if="pageState.showCategoyModal"
      :selected-id="pageState.selectedCategoryId"
    />
    <ProductPointModal
      v-model="pageState.showReorderingModal"
      v-if="pageState.showReorderingModal"
      :selected-id="pageState.selectedReorderingId"
    />
    <div class="flex flex-col gap-6">
      <CustomTable
        :has-pagination="true"
        class="w-[calc(100vw_-_328px)]"
        title="Product Reordering Point"
        :data="filteredReorderingPoints"
        @add-new-record="onNewReorderingPoint"
        :row-prop-init="productReorderingRowEvent"
        :table-row-component="ProductReorderingPointRow"
        @view="onViewReOrdering"
      >
        <template #table_header>
          <div class="grid grid-cols-5 gap-3 min-w-[430px]">
            <div class="col-span-1 flex gap-3 items-center">
              <input type="checkbox" class="input" />
              <p class="table-header">#</p>
            </div>
            <p class="table-header col-span-1">Points</p>
            <p class="table-header col-span-3">Products</p>
          </div>
        </template>
      </CustomTable>
      <CustomTable
        :has-add-btn="true"
        :has-pagination="true"
        @view="onViewCategory"
        :has-check-box="false"
        title="Product Categories"
        class="w-[calc(100vw_-_328px)]"
        :data="filteredProductCategories"
        @add-new-record="onNewProductCategory"
        :row-prop-init="productCategoryRowEvent"
        :table-row-component="ProductCategoryRow"
      >
        <template #table_header>
          <div class="grid gap-3 grid-cols-7 min-w-[550px] px-3">
            <div class="col-span-1 flex gap-3 items-center">
              <!-- <input type="checkbox" class="input" /> -->
              <p class="table-header">#</p>
            </div>
            <p class="col-span-3 table-header">Name</p>
            <p class="col-span-1 table-header">Sub Cats</p>
            <p class="col-span-2 table-header">Date Added</p>
          </div>
        </template>
      </CustomTable>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import ProductPointModal from '@/components/Settings/ProductPointModal.vue'
import ProductCategoryModal from '@/components/Settings/ProductCategoryModal.vue'
import ProductCategoryRow from '@/components/Settings/ProductCategoryRow.vue'
import { useSettingsStore } from '@/stores/settings'
import CustomTable from '@/components/shared/CustomTable.vue'
import ProductReorderingPointRow from '@/components/Settings/ProductReorderingPointRow.vue'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { useAppStore } from '@/stores/app'
import { ObjectHelpers } from 'shared'
import { InventoryConst, SettingConst } from '@/const/route.constants'
import { PageStateConst } from '@/const/state.constants'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const pageState = reactive({
  selectedCategoryId: -1,
  showCategoyModal: false,
  selectedReorderingId: -1,
  showReorderingModal: false
})

/** ================================================
 * EVENTS
 ** ================================================*/

Event.emit(EventEnum.IS_PAGE_LOADING, true)

// define Product categories row props
const productCategoryRowEvent = 'product-category-row-props-init'
Event.on(productCategoryRowEvent, function (item) {
  return { productCategory: item }
})

// define Product reordering point row props
const productReorderingRowEvent = 'product-reordering-row-props-init'
Event.on(productReorderingRowEvent, function (item) {
  return { productReordering: item }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredProductCategories = computed(() => {
  return settingsStore.productCategories.filter(
    (category) => !category.general_cat
  )
})

const filteredReorderingPoints = computed(() => {
  return settingsStore.productReorderingPoints.filter(() => true)
})

/** ================================================
 * METHODS
 ** ================================================*/
const onViewCategory = (id) => {
  pageState.selectedCategoryId = id
  pageState.showCategoyModal = true
}

const onViewReOrdering = (id) => {
  pageState.selectedReorderingId = id
  pageState.showReorderingModal = true
}

const onNewReorderingPoint = () => {
  pageState.selectedReorderingId = 0
  pageState.showReorderingModal = true
}

const onNewProductCategory = () => {
  pageState.selectedCategoryId = 0
  pageState.showCategoyModal = true
}

const setProductSettingPageState = () => {
  appStore.setPageState(PageStateConst.PRODUCT_SETTINGS, {
    state: pageState,
    route_scope: [SettingConst.PRODUCT_SETTINGS, InventoryConst.PRODUCT_FORM]
  })
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await settingsStore.getProductCategories()
  await settingsStore.fetchAllProductReorderingPoints()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)

  if (appStore.isPageExist(PageStateConst.PRODUCT_SETTINGS)) {
    if (
      !ObjectHelpers.compareObjects(
        pageState,
        appStore.pages[PageStateConst.PRODUCT_SETTINGS]
      )
    ) {
      let {
        selectedCategoryId,
        selectedReorderingId,
        showCategoyModal,
        showReorderingModal
      } = appStore.pages[PageStateConst.PRODUCT_SETTINGS].state

      pageState.selectedCategoryId = selectedCategoryId
      pageState.selectedReorderingId = selectedReorderingId
      pageState.showCategoyModal = showCategoyModal
      pageState.showReorderingModal = showReorderingModal
    }
  } else {
    setProductSettingPageState()
  }
})

/** ================================================
 * WATCHERS
 ** ================================================*/
watch(
  () => pageState,
  () => {
    setProductSettingPageState()
  },
  { deep: true }
)
</script>
