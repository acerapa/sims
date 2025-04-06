<template>
  <VendorModal v-model="showVendorModal" v-if="showVendorModal" />

  <AlertComponent
    v-if="!appStore.currentBranch"
    type="danger"
    :text="'Please select current branch'"
  >
    Please refer
    <RouterLink class="text-blue-400 underline" :to="{ name: 'branches' }">
      here!
    </RouterLink>
  </AlertComponent>
  <div class="flex flex-col gap-4">
    <div class="bg-white rounded-2xl p-4 shadow flex flex-col gap-3">
      <div class="flex justify-between items-center mb-4">
        <p
          class="text-base font-semibold text-success"
          v-if="status == PurchaseOrderStatus.COMPLETED"
        >
          Received Purchase Order
        </p>
        <p v-else class="text-base font-semibold">
          {{ isEdit ? 'Edit' : 'New' }} Purchase Order
        </p>

        <div class="flex gap-3 items-center">
          <SelectStatusDropdown
            :status-map="purchaseOrderStatus"
            v-model="model.order.status"
            :class="
              purchaseOrderStore.purchaseOrder &&
              purchaseOrderStore.purchaseOrder.status ===
                PurchaseOrderStatus.OPEN
                ? ''
                : 'pointer-events-none'
            "
          />
          <button
            class="btn-green"
            v-if="
              purchaseOrderStore.purchaseOrder &&
              purchaseOrderStore.purchaseOrder.status ===
                PurchaseOrderStatus.CONFIRMED
            "
            @click="onReceiveOrder"
          >
            Recevie Order
          </button>
          <button type="button" class="btn float-right" @click="startPrint">
            &#128438; Print
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex gap-6 max-[1180px]:flex-col">
          <div class="flex-1 flex flex-col gap-2">
            <p class="text-sm font-semibold">Order Info</p>
            <div class="flex flex-col gap-6">
              <div class="flex gap-3">
                <CustomInput
                  type="select"
                  class="flex-1"
                  :has-label="true"
                  label="Suppliers"
                  :has-add-new="true"
                  name="select_supplier"
                  :error-has-text="true"
                  :options="supplierOptions"
                  placeholder="*Select supplier"
                  :disabled="isEdit || isDisabled"
                  v-model="model.order.supplier_id"
                  @add-new="showVendorModal = true"
                  :error="errors.order?.supplier_id"
                />
                <CustomInput
                  type="select"
                  class="flex-1"
                  :has-label="true"
                  name="order_type"
                  label="Order Type"
                  placeholder="*Select Order Type"
                  v-model="model.order.type"
                  :options="[
                    {
                      text: 'Term',
                      value: PurchaseOrderType.TERM
                    },
                    {
                      text: 'COD',
                      value: PurchaseOrderType.COD
                    }
                  ]"
                  :disabled="isDisabled"
                  :error="errors.order?.type"
                  :error-has-text="true"
                />
              </div>
              <div class="flex gap-3">
                <CustomInput
                  type="text"
                  name="ref_no"
                  class="flex-1"
                  :has-label="true"
                  label="Reference No."
                  placeholder="Ref. No."
                  :disabled="isDisabled"
                  :error="errors.order?.ref_no"
                  v-model="model.order.ref_no"
                  :error-has-text="true"
                />
                <CustomInput
                  type="date"
                  class="flex-1"
                  :has-label="true"
                  name="start_term"
                  label="Term Start"
                  :disabled="isDisabled"
                  placeholder="Term Start"
                  v-model="model.order.term_start"
                  :error="modelErrors.term_start"
                  :error-has-text="true"
                  v-if="model.order.type == PurchaseOrderType.TERM"
                />
              </div>
              <div class="flex gap-3">
                <CustomInput
                  type="date"
                  name="date"
                  label="Date"
                  :has-label="true"
                  class="flex-1 max-h-[38px]"
                  placeholder="Date"
                  v-model="model.order.date"
                  :disabled="isDisabled"
                  :error-has-text="true"
                  :error="errors.order?.date"
                />
                <CustomInput
                  type="date"
                  name="bill_due"
                  class="flex-1"
                  :has-label="true"
                  label="Bill due"
                  placeholder="Bill Due"
                  v-model="model.order.bill_due"
                  :error="errors.order?.bill_due"
                  :error-has-text="true"
                  :disabled="isDisabled"
                />
              </div>
            </div>
          </div>
          <div class="flex-1 flex flex-col gap-2">
            <p class="text-sm font-semibold">Ship To Info</p>
            <AddressForm
              v-model="model.address"
              :has-label="true"
              :disabled="isDisabled"
              class="!gap-6 [&>div]:gap-6"
            />
          </div>
        </div>
        <CustomInput
          name="memo"
          label="Memo"
          type="textarea"
          :has-label="true"
          placeholder="Memo"
          :disabled="isDisabled"
          input-class="resize-none"
          v-model="model.order.memo"
          :error="modelErrors.memo"
          :error-has-text="true"
        />
      </div>

      <div class="flex justify-between items-center mt-6">
        <div class="flex gap-2 items-center">
          <p class="text-base font-semibold">
            {{
              model.order.status == PurchaseOrderStatus.COMPLETED
                ? 'Selected'
                : 'Select'
            }}
            Products
          </p>
          <small
            class="text-red-300 p-1 border border-red-300 rounded"
            v-if="!model.order.supplier_id"
          >
            Please select supplier first
          </small>
        </div>
      </div>

      <div ref="multiSelectTableWrap">
        <MultiSelectTable
          :header-component="PurchaseOrderFormHeader"
          :row-component="PurchaseOrderFormRow"
          :format="productFormat"
          v-model="model.products"
          :is-disabled="
            model.order.supplier_id &&
            model.order.status != PurchaseOrderStatus.COMPLETED
              ? false
              : true
          "
          :row-props="{
            sup_id: model.order.supplier_id.toString(),
            selected: model.products
          }"
          :row-event-name="rowEventName"
        >
          <template #aggregate>
            <p class="text-end w-full">
              Total: &#8369;
              {{
                model.order.amount.toLocaleString('en', {
                  minimumFractionDigits: 2
                })
              }}
            </p>
          </template>
        </MultiSelectTable>
      </div>

      <!-- buttons -->
      <div
        class="flex gap-3 mt-6"
        :class="route.query.id ? 'justify-between' : 'justify-end'"
      >
        <button class="btn-danger-outline" v-if="route.query.id">Delete</button>
        <div class="flex gap-3">
          <RouterLink
            :to="{ name: PurchaseConst.PURCHASE_ORDER }"
            class="btn-gray-outline"
          >
            {{ isDisabled ? 'Back' : 'Cancel' }}
          </RouterLink>
          <button
            type="button"
            class="btn-outline"
            @click="onSubmit(true)"
            v-if="!isEdit"
          >
            Save and New
          </button>
          <button type="button" class="btn" @click="onSubmit()" v-if="!isEdit">
            Save
          </button>

          <!-- edit page save button -->
          <button
            type="button"
            class="btn"
            v-if="isEdit && !isDisabled"
            @click="onSubmit"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SelectStatusDropdown from '@/components/stock-transfer/SelectStatusDropdown.vue'
import PurchaseOrderFormRow from '@/components/Inventory/PurchaseOrder/PurchaseOrderFormRow.vue'
import PurchaseOrderFormHeader from '@/components/Inventory/PurchaseOrder/PurchaseOrderFormHeader.vue'
import AddressForm from '@/components/shared/AddressForm.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import VendorModal from '@/components/Vendor/VendorModal.vue'
import AlertComponent from '@/components/shared/AlertComponent.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'

import { EventEnum } from '@/data/event'
import Event from '@/event'
import { getCost } from '@/helper'
import { useProductStore } from '@/stores/product'
import { usePurchaseOrderStore } from '@/stores/purchase-order'
import { useVendorStore } from '@/stores/supplier'
import { DateHelpers } from 'shared'
import {
  PurchaseOrderStatus,
  PurchaseOrderType,
  PurchaseStatusMap
} from 'shared/enums'
import { PurchaseOrderCreationSchema } from 'shared'
import { ObjectHelpers } from 'shared/helpers'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useSettingsStore } from '@/stores/settings'
import { usePrint } from '@/use/usePrint'
import { ToastTypes } from '@/data/types'
import { InventoryConst, PurchaseConst } from '@/const/route.constants'
import { PageStateConst } from '@/const/state.constants'
import { useTableScroll } from '@/use/useTableScroll'
import { useValidation } from '@/composables/useValidation'

const route = useRoute()
const router = useRouter()

const isEdit = ref(false)
const selectedStatus = ref()
const showVendorModal = ref(false)
const modelErrors = ref({ products: [] })
const status = ref(PurchaseOrderStatus.OPEN)

const appStore = useAppStore()
const { startPrint } = usePrint()
const supplierStore = useVendorStore()
const productStore = useProductStore()
const settingStore = useSettingsStore()
const purchaseOrderStore = usePurchaseOrderStore()

const productFormat = {
  product_id: '',
  name: '',
  description: '',
  quantity: '',
  cost: '',
  amount: ''
}

const modelDefualtValue = {
  order: {
    supplier_id: '',
    ref_no: '',
    date: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD'),
    bill_due: '',
    type: PurchaseOrderType.COD,
    memo: '',
    amount: 0,
    term_start: '',
    status: PurchaseOrderStatus.OPEN
  },
  address: {
    address1: '',
    address2: '',
    city: '',
    province: '',
    postal: ''
  },
  products: [{ ...productFormat }]
}

const model = ref(ObjectHelpers.copyObj(modelDefualtValue))

const { errors, hasErrors, validateData } = useValidation(
  PurchaseOrderCreationSchema,
  model.value
)

/** ================================================
 * EVENTS
 ** ================================================*/
const rowEventName = 'purchase-order-row-event'
// is page loading event
Event.emit(EventEnum.IS_PAGE_LOADING, true)

// Custom global event
const isCustomSelectFocused = ref(false)
Event.on('custom-select-focus', function (data) {
  isCustomSelectFocused.value = data
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const purchaseOrderStatus = computed(() => {
  let statuses = ObjectHelpers.copyObj(PurchaseStatusMap)
  Object.keys(statuses).forEach((key) => {
    statuses[key].isShow =
      key != PurchaseOrderStatus.CANCELLED &&
      key != PurchaseOrderStatus.COMPLETED
  })

  return statuses
})

const supplierOptions = computed(() => {
  return supplierStore.suppliers.map((supplier) => {
    return {
      value: supplier.id,
      text: supplier.company_name
    }
  })
})

const orderStatus = ref()
const isDisabled = computed(() => {
  return orderStatus.value
    ? orderStatus.value == PurchaseOrderStatus.CANCELLED ||
        orderStatus.value == PurchaseOrderStatus.COMPLETED ||
        orderStatus.value == PurchaseOrderStatus.CONFIRMED
    : false
})

/** ================================================
 * METHODS
 ** ================================================*/
const addNewProduct = () => {
  if (!isDisabled.value) {
    model.value.products.push({
      product_id: '',
      name: '',
      description: '',
      quantity: '',
      cost: '',
      amount: ''
    })
  }
}

const onSubmit = async (isAddNew = false) => {
  // pre modification
  if (model.value.order.type == PurchaseOrderType.COD) {
    delete model.value.order.term_start
  }

  // validation
  validateData()
  if (hasErrors.value) {
    console.log(errors.value)

    Event.emit(rowEventName, errors.value.products)
    return
  }

  let isSuccess = false
  if (route.query.id) {
    isSuccess = await purchaseOrderStore.updatePurchaseOrder(
      route.query.id,
      model.value
    )
  } else {
    isSuccess = await purchaseOrderStore.createPurchaseOrder(model.value)
  }

  if (isSuccess) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Purchase Order ${route.query.id ? 'Updated' : 'Created'} successfully!`,
      type: ToastTypes.SUCCESS,
      duration: 2000
    })

    if (!route.query.id) {
      // reset model
      model.value.products = []
      model.value.order = { ...modelDefualtValue.order }
      // get current branch address
      model.value.address = ObjectHelpers.assignSameFields(
        model.value.address,
        appStore.currentBranch.address
      )
      addNewProduct()

      if (!isAddNew) {
        router.push({
          name: PurchaseConst.PURCHASE_ORDER
        })
      }
    }
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Failed to ${route.query.id ? 'update' : 'create'} purchase order!`,
      type: ToastTypes.ERROR,
      duration: 2000
    })
  }
}

const onReceiveOrder = () => {
  router.push({
    name: PurchaseConst.PURCHASE_RECEIVE_ORDER,
    params: {
      id: route.query.id
    }
  })
}

const setPurchaseOrderFormPageState = () => {
  appStore.setPageState(PageStateConst.PURCHASE_ORDER_FORM, {
    route_scope: [
      InventoryConst.PRODUCT_FORM,
      PurchaseConst.PURCHASE_ORDER_FORM
    ],
    state: model.value
  })
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
const multiSelectTableWrap = ref(null)

// composables
useTableScroll(multiSelectTableWrap)

onMounted(async () => {
  // queries
  await supplierStore.getSuppliers()
  await productStore.getProducts()
  await settingStore.getBranches()

  if (route.query.id) {
    isEdit.value = true
    await purchaseOrderStore.getPurchaseOrder(route.query.id)
    status.value = purchaseOrderStore.purchaseOrder.status
    const order = purchaseOrderStore.purchaseOrder
    orderStatus.value = order.status
    selectedStatus.value = PurchaseStatusMap[order.status]
    model.value.address = ObjectHelpers.assignSameFields(
      model.value.address,
      order.address
    )
    model.value.order = {
      supplier_id: order.supplier.id,
      amount: order.amount,
      bill_due: DateHelpers.formatDate(order.bill_due, 'YYYY-MM-DD'),
      date: DateHelpers.formatDate(order.date, 'YYYY-MM-DD'),
      memo: order.memo,
      ref_no: order.ref_no,
      type: order.type,
      status: order.status
    }
    model.value.products = [
      ...order.products.map((product) => {
        return {
          product_id: product.id,
          name: product.name,
          description: product.PurchaseOrderProducts.description
            ? product.PurchaseOrderProducts.description
            : product.purchase_description,
          quantity: product.PurchaseOrderProducts.quantity,
          cost: getCost(
            product.PurchaseOrderProducts.cost,
            product,
            order.supplier_id
          ),
          amount: product.PurchaseOrderProducts.amount
        }
      })
    ]
  }

  // get current branch address
  if (appStore.currentBranch) {
    model.value.address = ObjectHelpers.assignSameFields(
      model.value.address,
      appStore.currentBranch.address
    )
  }

  if (appStore.isPageExist(PageStateConst.PURCHASE_ORDER_FORM)) {
    if (
      !ObjectHelpers.compareObjects(
        model.value,
        appStore.pages[PageStateConst.PURCHASE_ORDER_FORM].state
      )
    ) {
      model.value = ObjectHelpers.assignSameFields(
        model.value,
        appStore.pages[PageStateConst.PURCHASE_ORDER_FORM].state
      )
    }
  } else {
    setPurchaseOrderFormPageState()
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

/** ================================================
 * WATCHERS
 ** ================================================*/
watch(
  () => model.value.order.supplier_id,
  (val) => {
    supplierStore.selectedSupplier = supplierStore.suppliers.find(
      (sup) => sup.id == val
    )

    // remove the products in the order which are not related to the supplier
    model.value.products = model.value.products.filter((prod) => {
      if (!prod.id) return true
      const p = productStore.products.find((prd) => prd.id == prod.id)
      if (p) {
        return p.suppliers.map((sup) => sup.id).includes(val)
      }
    })
  }
)

watch(
  () => model.value,
  () => {
    setPurchaseOrderFormPageState()

    // If there are changes in the model run these
    if (model.value.products.length) {
      model.value.order.amount = model.value.products
        .filter((p) => p.amount)
        .map((prod) => parseInt(prod.amount))
        .reduce((a, b) => a + b, 0)
    }
  },
  { deep: true }
)
</script>
