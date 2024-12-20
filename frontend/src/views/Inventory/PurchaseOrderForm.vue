<template>
  <ModalWrapper
    title="Update order status"
    v-if="statusModal"
    v-model="statusModal"
    :save-btn="'Done'"
    @submit="statusModal = false"
  >
    <form action="" method="post" class="mt-7">
      <fieldset class="flex gap-4 justify-center">
        <label
          class="flex gap-3 items-center"
          v-for="(st, ndx) in Object.values(PurchaseStatusMap).filter(
            (s) => s.text !== 'Completed'
          )"
          :key="ndx"
          :for="st.text"
        >
          <input
            type="radio"
            name="status"
            :id="st.text"
            class="cursor-pointer"
            v-model="model.order.status"
            :value="st.text.toLowerCase()"
            @change="
              () => {
                selectedStatus = PurchaseStatusMap[model.order.status]
                onUpdate()
              }
            "
          />
          <BadgeComponent :custom-class="st.class" :text="st.text" />
        </label>
      </fieldset>
    </form>
  </ModalWrapper>

  <VendorModal v-model="showVendorModal" v-if="showVendorModal" />
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

        <div class="flex gap-3">
          <BadgeComponent
            v-if="isEdit && selectedStatus"
            :custom-class="selectedStatus.class"
            :text="selectedStatus.text"
            title="Click to set status"
            @click="
              statusModal =
                model.order.status != PurchaseOrderStatus.CANCELLED &&
                model.order.status != PurchaseOrderStatus.COMPLETED &&
                model.order.status != PurchaseOrderStatus.CONFIRMED
            "
          />
          <button
            class="btn-green"
            v-if="model.order.status == PurchaseOrderStatus.CONFIRMED"
            @click="onReceiveOrder"
          >
            Receive Order
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
                  :options="supplierOptions"
                  placeholder="*Select supplier"
                  v-model="model.order.supplier_id"
                  @add-new="showVendorModal = true"
                  :disabled="isEdit || isDisabled"
                  :error="modelErrors.supplier_id"
                  :error-has-text="true"
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
                  :error="modelErrors.type"
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
                  :error="modelErrors.ref_no"
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
                  :error="modelErrors.date"
                />
                <CustomInput
                  type="date"
                  name="bill_due"
                  class="flex-1"
                  :has-label="true"
                  label="Bill due"
                  placeholder="Bill Due"
                  v-model="model.order.bill_due"
                  :error="modelErrors.bill_due"
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
        <p class="text-base font-semibold">Select Products</p>
      </div>

      <div class="max-[750px]:w-[calc(100vw-328px)]">
        <div class="flex flex-col gap-4 max-w-full overflow-x-auto mb-4 pb-4">
          <PurchaseOrderFormHeader :is-disabled="isDisabled" />
          <div class="flex flex-col gap-4">
            <PurchaseOrderFormRow
              v-for="(product, ndx) in model.products"
              v-model="model.products[ndx]"
              :key="ndx"
              :errors="
                modelErrors.products[ndx] ? modelErrors.products[ndx] : {}
              "
              @remove="removeProduct(ndx)"
              :selected-products="model.products"
              :is-disabled="isDisabled"
              :sup_id="model.order.supplier_id.toString()"
            >
            </PurchaseOrderFormRow>
          </div>
          <div class="flex flex-col gap-4" v-if="!model.products.length">
            <p class="text-center text-sm">Table has no data!</p>
          </div>
        </div>
        <div class="flex justify-between items-center pb-3">
          <button
            class="btn w-fit"
            :class="[isDisabled ? 'pointer-events-none opacity-0' : '']"
            @click="addNewProduct"
          >
            Add new item
          </button>
          <p>
            Total: &#8369;
            {{
              model.order.amount.toLocaleString('en', {
                minimumFractionDigits: 2
              })
            }}
          </p>
        </div>
      </div>

      <!-- buttons -->
      <div
        class="flex gap-3 mt-6"
        :class="route.query.id ? 'justify-between' : 'justify-end'"
      >
        <button class="btn-danger-outline" v-if="route.query.id">Delete</button>
        <div class="flex gap-3">
          <RouterLink :to="{ name: 'purchase-order' }" class="btn-gray-outline">
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
            @click="onUpdate"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import { Method, authenticatedApi } from '@/api'
import PurchaseOrderFormRow from '@/components/Inventory/PurchaseOrder/PurchaseOrderFormRow.vue'
import PurchaseOrderFormHeader from '@/components/Inventory/PurchaseOrder/PurchaseOrderFormHeader.vue'
import AddressForm from '@/components/shared/AddressForm.vue'
import BadgeComponent from '@/components/shared/BadgeComponent.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import VendorModal from '@/components/Vendor/VendorModal.vue'
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

const route = useRoute()
const isEdit = ref(false)
const router = useRouter()
const selectedStatus = ref()
const statusModal = ref(false)
const showVendorModal = ref(false)
const modelErrors = ref({ products: [] })
const status = ref(PurchaseOrderStatus.OPEN)

const appStore = useAppStore()
const supplierStore = useVendorStore()
const productStore = useProductStore()
const settingStore = useSettingsStore()
const purchaseOrderStore = usePurchaseOrderStore()

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
  products: [
    {
      product_id: '',
      name: '',
      description: '',
      quantity: '',
      cost: '',
      amount: ''
    }
  ]
}

const model = ref(ObjectHelpers.copyObj(modelDefualtValue))

/** ================================================
 * EVENTS
 ** ================================================*/

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

const removeProduct = (ndx) => {
  model.value.products.splice(ndx, 1)
}

const onSubmit = async (isAddNew = false) => {
  // pre modification
  if (model.value.order.type == PurchaseOrderType.COD) {
    delete model.value.order.term_start
  }

  // validation
  const { error } = PurchaseOrderCreationSchema.validate(model.value, {
    abortEarly: false
  })
  if (error) {
    modelErrors.value.products = Object.groupBy(
      error.details.filter((item) => {
        return item.path.includes('products')
      }),
      (err) => {
        return err.path[1]
      }
    )

    const keys = Object.keys(modelErrors.value.products)
    keys.forEach((key) => {
      let prdErr = {}
      modelErrors.value.products[key].forEach((item) => {
        prdErr[item.context.key] = item.message
      })

      modelErrors.value.products[key] = prdErr
    })

    error.details.forEach((item) => {
      if (!item.path.includes('products')) {
        modelErrors.value[item.context.key] = item.message
      }
    })

    return
  }

  const res = await authenticatedApi(
    'purchase-order/register',
    Method.POST,
    model.value
  )

  if (res.status == 200) {
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
        name: 'purchase-order'
      })
    }
  }
}

const onUpdate = async () => {
  if (route.query.id) {
    Event.emit(EventEnum.IS_PAGE_LOADING, true)
    const res = await authenticatedApi(
      `purchase-order/${route.query.id}/update`,
      Method.POST,
      model.value
    )

    if (res.status == 200) {
      console.log('Api is working and need to check the result in db')
    }
    Event.emit(EventEnum.IS_PAGE_LOADING, false)
  }
}

const onReceiveOrder = () => {
  router.push({
    name: 'purchase-receive-order',
    params: {
      id: route.query.id
    }
  })
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await supplierStore.fetchAllSuppliers()
  await productStore.fetchAllProducts()
  await settingStore.getBranches()
  if (route.query.id) {
    isEdit.value = true
    await purchaseOrderStore.fetchPurchaseOrderById(route.query.id)
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
          description: product.ProductTransaction.description
            ? product.ProductTransaction.description
            : product.purchase_description,
          quantity: product.ProductTransaction.quantity,
          cost: getCost(
            product.ProductTransaction.cost,
            product,
            order.supplier_id
          ),
          amount: product.ProductTransaction.amount
        }
      })
    ]
  }

  // get current branch address
  model.value.address = ObjectHelpers.assignSameFields(
    model.value.address,
    appStore.currentBranch.address
  )

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
  () => model.value.products,
  () => {
    if (model.value.products.length) {
      model.value.order.amount = model.value.products
        .map((prod) => prod.amount)
        .reduce((a, b) => a + b, 0)
    }
  },
  {
    deep: true
  }
)
</script>
