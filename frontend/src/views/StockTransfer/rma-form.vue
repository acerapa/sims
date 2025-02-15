<template>
  <DeleteConfirmModal
    v-if="showConfirmModal && route.query.id"
    v-model="showConfirmModal"
    :href="`stock-transfer/${route.query.id}`"
    @after-delete="onAfterDelete"
  />
  <div class="cont flex flex-col gap-6 relative">
    <div
      class="flex items-center justify-end gap-3 absolute top-4 right-4"
      v-if="route.query.id"
    >
      <SelectStatusDropdown v-model="model.transfer.status" />
      <button type="button" class="btn float-right">&#128438; Print</button>
    </div>
    <AlertComponent
      v-if="!currentBranch"
      type="danger"
      :text="'Please select current branch'"
    >
      Please refer
      <RouterLink class="text-blue-400 underline" :to="{ name: 'branches' }">
        here!
      </RouterLink>
    </AlertComponent>
    <div class="flex gap-6">
      <div class="flex-1">
        <p class="font-bold">Transfer Information</p>
        <div
          class="flex gap-3 items-center max-lg:flex-col max-lg:gap-3 max-lg:items-start max-lg:[&>div]:w-full"
        >
          <CustomInput
            type="select"
            class="flex-1"
            name="supplier"
            :has-label="true"
            :error-has-text="true"
            label="Select supplier"
            :options="supplierOptions"
            placeholder="Select supplier"
            :error="modelErrors.supplier_id"
            v-model="model.transfer.supplier_id"
          />
          <CustomInput
            name="when"
            label="When"
            class="flex-1"
            :has-label="true"
            type="datetime-local"
            v-model="model.transfer.when"
          />
        </div>
        <CustomInput
          class="flex-1 mt-3"
          type="textarea"
          name="memo"
          label="Memo"
          :has-label="true"
          placeholder="Memo"
          v-model="model.transfer.memo"
        />
      </div>
      <div class="flex-1">
        <p class="font-bold">Supplier address information</p>
        <AddressForm v-model="address" :disabled="true" :has-label="true" />
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <p class="font-bold">Select Products</p>
      <MultiSelectTable
        v-model="model.products"
        :header-component="RmaProductSelectHeader"
        :row-component="RmaProductSelectRow"
        :format="productDefaultValue"
        :row-event-name="rowEventName"
      >
      </MultiSelectTable>

      <div
        class="flex gap-3 mt-4"
        :class="route.query.id ? 'justify-between' : 'justify-end'"
      >
        <button
          class="btn-danger-outline"
          @click="showConfirmModal = true"
          v-if="route.query.id"
        >
          Delete
        </button>
        <div class="flex gap-3">
          <button class="btn-gray-outline" @click="onCancel">Cancel</button>
          <button
            class="btn-outline disabled:opacity-50"
            :disabled="false"
            v-if="!isEdit"
          >
            Save and New
          </button>
          <button
            class="btn disabled:opacity-50"
            @click="onSubmit"
            :disabled="false"
          >
            {{ isEdit ? 'Update' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import AddressForm from '@/components/shared/AddressForm.vue'
import AlertComponent from '@/components/shared/AlertComponent.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import RmaProductSelectRow from '@/components/stock-transfer/RmaProductSelectRow.vue'
import RmaProductSelectHeader from '@/components/stock-transfer/RmaProductSelectHeader.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import { useVendorStore } from '@/stores/supplier'
import { computed, onMounted, ref, watch } from 'vue'
import { DateHelpers, ObjectHelpers } from 'shared/helpers'
import { StockTransferStatus, TransferType } from 'shared/enums'
import { useRoute, useRouter } from 'vue-router'
import { useTransferStore } from '@/stores/transfer'
import { useAppStore } from '@/stores/app'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import {
  StockTransferCreateSchema,
  Joi,
  ProductTransferSchema
} from 'shared/validators'
import { ToastTypes } from '@/data/types'
import { InventoryConst, TransferConst } from '@/const/route.constants'
import { PageStateConst } from '@/const/state.constants'
import SelectStatusDropdown from '@/components/stock-transfer/SelectStatusDropdown.vue'

const rowEventName = 'rma-product-event'

const route = useRoute()
const isEdit = ref(false)
const router = useRouter()
const appStore = useAppStore()
const currentBranch = ref(null)
const authStore = useAuthStore() // this is temporary
const showConfirmModal = ref(false)
const transferStore = useTransferStore()
const settingsStore = useSettingsStore() // this is temporaru

const address = ref({
  address1: '',
  address2: '',
  city: '',
  province: '',
  state: '',
  postal: ''
})

const productDefaultValue = {
  product_id: '',
  description: '',
  quantity: '',
  serial_number: '',
  problem: '',
  cost: '',
  amount: ''
}

const vendorStore = useVendorStore()

const defualtValue = {
  transfer: {
    supplier_id: '',
    when: DateHelpers.formatDate(new Date(), 'YYYY-MM-DDTHH:II-A'),
    memo: '',
    branch_from: '',
    processed_by: '',
    type: TransferType.RMA,
    status: StockTransferStatus.OPEN
  },
  products: [{ ...productDefaultValue }]
}

const model = ref({ ...defualtValue })
const modelErrors = ref({})

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/
const supplierOptions = computed(() => {
  return vendorStore.suppliers.map((supplier) => {
    return {
      text: supplier.company_name,
      value: supplier.id
    }
  })
})

/** ================================================
 * METHODS
 ** ================================================*/
const populateAddress = () => {
  const supplier = vendorStore.suppliers.find((supplier) => {
    return supplier.id === model.value.transfer.supplier_id
  })

  address.value = ObjectHelpers.assignSameFields(
    address.value,
    supplier.address
  )
}

const onSubmit = async () => {
  // validate model
  // modify validation schema
  const RMAProductSchema = ProductTransferSchema.keys({
    serial_number: Joi.string().required(),
    problem: Joi.string().required()
  })
  const StockTransferSchema = StockTransferCreateSchema.keys({
    products: Joi.array().items(RMAProductSchema).required()
  })

  const { error } = StockTransferSchema.validate(model.value, {
    abortEarly: false
  })

  if (error) {
    modelErrors.value.products = []

    error.details.forEach((err) => {
      if (err.path.includes('products')) {
        modelErrors.value.products.push(err)
      } else {
        modelErrors.value[err.context.key] = err.message
      }
    })

    modelErrors.value.products = Object.groupBy(
      modelErrors.value.products,
      (err) => err.path[1]
    )

    const keys = Object.keys(modelErrors.value.products)
    keys.forEach((key) => {
      let prdErr = {}
      modelErrors.value.products[key].forEach((item) => {
        prdErr[item.context.key] = item.message
      })

      modelErrors.value.products[key] = prdErr
    })

    // trigger event to show errors
    Event.emit(rowEventName, modelErrors.value.products)
    return
  }

  let isSuccess = false
  if (!isEdit.value) {
    model.value.transfer.when = new Date()
    isSuccess = await transferStore.createTransfer(model.value)
  } else {
    isSuccess = await transferStore.updateTransfer(model.value, route.query.id)
  }

  if (isSuccess) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Successfully ${isEdit.value ? 'updated' : 'created'} RMA!`,
      type: ToastTypes.SUCCESS
    })
    router.push({
      name: TransferConst.RMA_LIST
    })
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Failed to ${isEdit.value ? 'update' : 'create'} RMA!`,
      type: ToastTypes.ERROR
    })
  }
}

const onCancel = () => {
  router.back()
}

const onAfterDelete = async () => {
  await transferStore.removeTransfer(route.query.id)
  router.push({
    name: TransferConst.RMA_LIST
  })
}

const setRMAFormPageState = () => {
  appStore.setPageState(PageStateConst.RMA_FORM, {
    route_scope: [InventoryConst.PRODUCT_FORM, TransferConst.RMA_FORM],
    state: model.value
  })
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await vendorStore.getSuppliers()
  await settingsStore.getBranches()
  currentBranch.value = appStore.currentBranch

  model.value.transfer.branch_from = currentBranch.value
    ? currentBranch.value.id
    : ''
  model.value.transfer.processed_by = authStore.getAuthUser().id

  if (route.query.id) {
    const rma = await transferStore.getById(route.query.id)

    if (rma) {
      model.value.transfer = ObjectHelpers.assignSameFields(
        model.value.transfer,
        rma
      )
      model.value.transfer.when = DateHelpers.formatDate(
        new Date(),
        'YYYY-MM-DDTHH:II:SS-A'
      )

      model.value.products = rma.products.map((p) => {
        return {
          product_id: p.StockTransferProducts.product_id,
          description: p.StockTransferProducts.description,
          quantity: p.StockTransferProducts.quantity,
          cost: p.StockTransferProducts.cost,
          amount: p.StockTransferProducts.amount,
          problem: p.StockTransferProducts.problem,
          serial_number: p.StockTransferProducts.serial_number
        }
      })
    } else {
      console.log('RMA not found')
    }

    isEdit.value = true
  }

  // set page state
  if (appStore.isPageExist(PageStateConst.RMA_FORM)) {
    console.log(
      !ObjectHelpers.compareObjects(
        model.value,
        appStore.pages[PageStateConst.RMA_FORM].state
      )
    )
    if (
      !ObjectHelpers.compareObjects(
        model.value,
        appStore.pages[PageStateConst.RMA_FORM].state
      )
    ) {
      model.value = ObjectHelpers.assignSameFields(
        model.value,
        appStore.pages[PageStateConst.RMA_FORM].state
      )
    }
  } else {
    setRMAFormPageState()
  }

  // open account
  // closed account

  //gigabook.

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

/** ================================================
 * WATCHERS
 ** ================================================*/
watch(
  () => model.value,
  () => {
    setRMAFormPageState()

    if (model.value.transfer.supplier_id) {
      populateAddress()
    }
  },
  { deep: true }
)
</script>
