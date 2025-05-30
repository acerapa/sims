<template>
  <DeleteConfirmModal
    v-if="showConfirmModal"
    v-model="showConfirmModal"
    @after-delete="onAfterDelete"
    :href="`stock-transfer/${route.query.id}`"
  />
  <div class="flex flex-col gap-4">
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
    <div class="cont relative">
      <div
        class="flex items-center justify-end gap-3 absolute top-4 right-4"
        v-if="route.query.id"
      >
        <SelectStatusDropdown
          v-model="model.transfer.status"
          :status-map="StockTransferStatusMap"
          :class="isCompleted || isCancelled ? 'pointer-events-none' : ''"
        />
        <button type="button" class="btn float-right" @click="startPrint">
          &#128438; Print
        </button>
      </div>
      <div class="flex gap-4 max-lg:flex-col">
        <div class="flex flex-col gap-3 flex-1">
          <div class="flex justify-between">
            <p class="text-base font-semibold">Transfer Information</p>
          </div>
          <div class="flex gap-3">
            <CustomInput
              type="select"
              name="branch"
              class="flex-1"
              :has-label="true"
              :options="branchOptions"
              placeholder="Select Branch"
              label="Select Receiving Branch"
              v-model="model.transfer.branch_to"
              :error="errors.transfer?.branch_to"
              :error-has-text="true"
              :disabled="isCompleted || isCancelled"
            />
            <CustomInput
              type="datetime-local"
              name="date"
              class="flex-1"
              :has-label="true"
              label="Date and Time"
              :disabled="true"
              v-model="model.transfer.when"
            />
          </div>

          <CustomInput
            type="textarea"
            :has-label="true"
            label="Memo"
            name="memo"
            v-model="model.transfer.memo"
            placeholder="Write Something"
            :error="errors.transfer?.memo"
            :error-has-text="true"
            :disabled="isCompleted || isCancelled"
          />
        </div>

        <div class="flex flex-col gap-3 flex-1">
          <p class="text-base font-semibold">Address Info</p>
          <AddressForm
            v-model="address"
            :has-label="true"
            :disabled="true"
            :address-errors="errors.address"
          />
        </div>
      </div>
      <div class="flex flex-col gap-3 mt-5" ref="multiSelectTableWrap">
        <p class="text-base font-semibold">Select Product</p>
        <ProductMulitpleSelect
          v-model="model.products"
          :header-component="ProductSelectHeader"
          :row-component="ProductSelectRow"
          :format="{ ...productDefaultValue }"
          :row-event-name="rowEventName"
          :is-disabled="isCompleted || isCancelled"
        >
          <template v-slot:aggregate>
            <div>
              <span class="font-bold text-sm">Total: </span>
              <span class="text-sm">
                &#8369;
                {{
                  totalAmount
                    ? totalAmount.toLocaleString('en', {
                        minimumFractionDigits: 2
                      })
                    : '0.00'
                }}
              </span>
            </div>
          </template>
        </ProductMulitpleSelect>
      </div>
      <div
        class="flex gap-3 mt-4"
        :class="route.query.id ? 'justify-between' : 'justify-end'"
      >
        <button
          class="btn-danger-outline"
          @click="showConfirmModal = true"
          v-if="route.query.id && !isCompleted && !isCancelled"
        >
          Delete
        </button>
        <div class="flex gap-3" v-if="!isCompleted && !isCancelled">
          <button class="btn-gray-outline" @click="onCancel">Cancel</button>
          <button
            class="btn-outline disabled:opacity-50"
            :disabled="!currentBranch"
            v-if="!isEdit"
            @click="onSubmit(true)"
          >
            Save and New
          </button>
          <button
            class="btn disabled:opacity-50"
            @click="onSubmit(false)"
            :disabled="!currentBranch"
          >
            {{ isEdit ? 'Update' : 'Save' }}
          </button>
        </div>
        <div
          class="flex gap-3 justify-end w-full"
          v-if="isCompleted || isCancelled"
        >
          <button class="btn-gray-outline" @click="onCancel">Back</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import AddressForm from '@/components/shared/AddressForm.vue'
import AlertComponent from '@/components/shared/AlertComponent.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import SelectStatusDropdown from '@/components/stock-transfer/SelectStatusDropdown.vue'
import ProductSelectRow from '@/components/stock-transfer/ProductSelectRow.vue'
import ProductMulitpleSelect from '@/components/shared/MultiSelectTable.vue'
import ProductSelectHeader from '@/components/stock-transfer/ProductSelectHeader.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import { useSettingsStore } from '@/stores/settings'
import { useTransferStore } from '@/stores/transfer'
import {
  StockTransferStatus,
  StockTransferStatusMap,
  TransferType
} from 'shared/enums'
import { DateHelpers, ObjectHelpers } from 'shared/helpers'
import { StockTransferCreateSchema } from 'shared'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { usePrint } from '@/use/usePrint'
import { ToastTypes } from '@/data/types'
import { InventoryConst, TransferConst } from '@/const/route.constants'
import { PageStateConst } from '@/const/state.constants'
import { validateProductStocks } from '@/helper'
import { useTableScroll } from '@/use/useTableScroll'
import { useValidation } from '@/composables/useValidation'
import { useAuth } from '@/composables/useAuth'

const rowEventName = 'str-product-row'

const route = useRoute()
const router = useRouter()
const isEdit = ref(false)
const appStore = useAppStore()
const { startPrint } = usePrint()
const productStore = useProductStore()
const settingStore = useSettingsStore()
const transferStore = useTransferStore()

const productDefaultValue = {
  product_id: '',
  quantity: '',
  cost: '',
  amount: ''
}

const address = ref({
  address1: '',
  address2: '',
  province: '',
  city: '',
  postal: ''
})

const defaultValue = {
  transfer: {
    memo: '',
    branch_to: '',
    branch_from: '',
    processed_by: '',
    type: TransferType.STR,
    status: StockTransferStatus.OPEN,
    when: DateHelpers.formatDate(new Date(), 'YYYY-MM-DDTHH:II-A')
  },
  products: [{ ...productDefaultValue }]
}

const currentBranch = ref()
const model = ref(ObjectHelpers.copyObj(defaultValue))
const showConfirmModal = ref(false)

// composables
const { errors, hasErrors, validateData } = useValidation(
  StockTransferCreateSchema,
  model.value
)

const { getAuthUser } = useAuth()

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/
const totalAmount = computed(() => {
  const toReduce = model.value.products.length
    ? model.value.products
        .filter((p) => p.amount)
        .map((p) => parseInt(p.amount))
    : []

  return toReduce.length ? toReduce.reduce((a, b) => a + b) : 0
})

const isCompleted = computed(() => {
  return transferStore.transfer
    ? transferStore.transfer.status === StockTransferStatus.COMPLETED
    : false
})

const isCancelled = computed(() => {
  return transferStore.transfer
    ? transferStore.transfer.status === StockTransferStatus.CANCELLED
    : false
})

const branchOptions = computed(() => {
  return settingStore.branches
    .map((branch) => {
      return {
        text: branch.name,
        value: branch.id
      }
    })
    .filter((opt) =>
      currentBranch.value ? currentBranch.value.id != opt.value : true
    )
})

/** ================================================
 * METHODS
 ** ================================================*/

// TODO: Regulate the interval when to have or not.
const timeInterval = setInterval(() => {
  if (route.query.id) {
    model.value.transfer.when = DateHelpers.formatDate(
      new Date(),
      'YYYY-MM-DDTHH:II:SS-A'
    )
  }
}, 1000)

const populateAddress = () => {
  if (model.value.transfer.branch_to) {
    const branch = settingStore.branches.find(
      (b) => b.id == model.value.transfer.branch_to
    )

    if (branch) {
      address.value = ObjectHelpers.assignSameFields(
        address.value,
        branch.address
      )
    }
  }
}

const onSubmit = async (saveAndNew = false) => {
  clearInterval(timeInterval)

  // validate model
  validateData()

  if (hasErrors.value) {
    if (errors.value?.products) {
      Event.emit(rowEventName, errors.value.products)
    }
    return
  }

  // validate products stocks availability
  const productAvailabilityError = validateProductStocks(
    model.value.products,
    await productStore.getProducts()
  )

  if (productAvailabilityError) {
    // specific to product stocks availability
    // TEMPORARY SOLUTION
    errors.value.products = []
    const idWithError = Object.keys(productAvailabilityError)
    model.value.products.forEach((p) => {
      if (idWithError.includes(p.product_id.toString())) {
        errors.value.products.push({
          quantity: productAvailabilityError[p.product_id]
        })
      } else {
        errors.value.products.push({})
      }
    })

    Event.emit(rowEventName, errors.value.products)
    return
  }

  let isSuccess = false
  if (!isEdit.value) {
    model.value.transfer.when = DateHelpers.formatDate(
      new Date(),
      'YYYY-MM-DDTHH:II-A'
    )
    isSuccess = await transferStore.createTransfer(model.value)
  } else {
    isSuccess = await transferStore.updateTransfer(model.value, route.query.id)
  }

  if (isSuccess) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Successfully ${isEdit.value ? 'updated' : 'created'} STR!`,
      type: ToastTypes.SUCCESS
    })

    if (saveAndNew) {
      model.value = ObjectHelpers.copyObj(defaultValue)
      setCurrentBranch()
      await setProccessedBy()
    } else {
      if (!isEdit.value) {
        router.push({
          name: TransferConst.STR_LIST
        })
      }
    }
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Failed to ${isEdit.value ? 'update' : 'create'} STR!`,
      type: ToastTypes.ERROR
    })
  }
}

const onCancel = () => {
  router.push({
    name: TransferConst.STR_LIST
  })
}

const onAfterDelete = async () => {
  await transferStore.removeTransfer(route.query.id)
  router.push({
    name: TransferConst.STR_LIST
  })
}

const setCurrentBranch = () => {
  currentBranch.value = appStore.currentBranch
  if (currentBranch.value) {
    model.value.transfer.branch_from = currentBranch.value.id
  }
}

const setProccessedBy = async () => {
  const user = await getAuthUser()
  model.value.transfer.processed_by = user?.id
}

const setSTRFromPageState = () => {
  appStore.setPageState(PageStateConst.STR_FORM, {
    route_scope: [InventoryConst.PRODUCT_FORM, TransferConst.STR_FORM],
    state: model.value
  })
}

const multiSelectTableWrap = ref(null)
useTableScroll(multiSelectTableWrap)
/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await productStore.getProducts()
  await settingStore.getBranches()

  // check if there is an id query param
  if (route.query.id) {
    // clear interval automatically
    clearInterval(timeInterval)

    const transfer = await transferStore.getById(route.query.id)

    if (transfer) {
      // model.value = ObjectHelpers.assignSameFields(model.value, transfer);
      model.value.transfer = ObjectHelpers.assignSameFields(
        model.value.transfer,
        transfer
      )

      // custom modification
      model.value.transfer.when = DateHelpers.formatDate(
        new Date(transfer.when),
        'YYYY-MM-DDTHH:II:SS-A'
      )

      // populate products
      model.value.products = transfer.products.map((p) => {
        return {
          product_id: p.StockTransferProducts.product_id,
          quantity: p.StockTransferProducts.quantity,
          cost: p.StockTransferProducts.cost,
          amount: p.StockTransferProducts.amount
        }
      })
    } else {
      //TODO: raise and error or alert or maybe navigate to 404 notifs
      console.error('STR not found')
    }

    isEdit.value = true
  }

  // set branch from
  setCurrentBranch()

  // set processed by
  await setProccessedBy()

  // set page state
  if (appStore.isPageExist(PageStateConst.STR_FORM)) {
    if (
      !ObjectHelpers.compareObjects(
        model.value,
        appStore.pages[PageStateConst.STR_FORM].state
      )
    ) {
      model.value = ObjectHelpers.assignSameFields(
        model.value,
        appStore.pages[PageStateConst.STR_FORM].state
      )
    }
  } else {
    setSTRFromPageState()
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

onBeforeUnmount(() => {
  // remove interval
  clearInterval(timeInterval)

  // remove transfer set on the state
  transferStore.transfer = null
})

/** ================================================
 * WATCHERS
 ** ================================================*/
watch(
  () => model.value,
  () => {
    setSTRFromPageState()

    if (model.value.transfer.branch_to) {
      populateAddress()
    }
  },
  { deep: true }
)
</script>
