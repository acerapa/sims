<template>
  <DeleteConfirmModal
    v-if="showConfirmModal"
    v-model="showConfirmModal"
    :href="`stock-transfer/${route.query.id}`"
    @after-delete="onAfterDelete"
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
          :class="isCancelled || isCompleted ? 'pointer-events-none' : ''"
        />
        <button type="button" class="btn float-right">&#128438; Print</button>
      </div>
      <div class="flex gap-3">
        <div class="flex-1">
          <p class="font-semibold">Receive Information</p>
          <div class="flex gap-3 items-center mt-3">
            <CustomInput
              type="datetime-local"
              name="when"
              :has-label="true"
              label="Receiving date and time"
              :disabled="true"
              v-model="model.transfer.when"
            />
          </div>
          <div class="flex gap-3 items-center">
            <CustomInput
              type="text"
              name="str#"
              class="flex-1"
              :has-label="true"
              label="Str #"
              placeholder="Ex. 01"
              :error-has-text="true"
              v-model="model.transfer.str_id"
              :error="errors.transfer?.str_id"
              :disabled="isCancelled || isCompleted"
            />
            <CustomInput
              type="select"
              name="branch_to"
              class="flex-1"
              :has-label="true"
              label="From Branch"
              :error-has-text="true"
              :options="branchOptions"
              placeholder="Select Branch"
              v-model="model.transfer.branch_from"
              :error="errors.transfer?.branch_from"
              :disabled="isCancelled || isCompleted"
            />
          </div>
          <CustomInput
            type="textarea"
            name="memo"
            class="mt-3"
            :has-label="true"
            label="Memo"
            v-model="model.transfer.memo"
            placeholder="Write Something"
            :disabled="isCancelled || isCompleted"
          />
        </div>
        <div class="flex-1">
          <p class="font-semibold">Branch Address Information</p>
          <AddressForm :has-label="true" v-model="address" :disabled="true" />
        </div>
      </div>
      <div class="flex flex-col gap-3 mt-8" ref="multiSelectTableWrap">
        <p class="font-semibold">Select Product</p>
        <MultiSelectTable
          v-model="model.products"
          :header-component="IbrrSelectHeader"
          :row-component="ProductSelectRow"
          :format="productDefaultValue"
          :row-event-name="ibrrEventName"
          :is-disabled="isCancelled || isCompleted"
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
        </MultiSelectTable>
      </div>
      <div
        class="flex gap-3 mt-4"
        :class="route.query.id ? 'justify-between' : 'justify-end'"
        v-if="!isCancelled && !isCompleted"
      >
        <button
          class="btn-danger-outline"
          v-if="route.query.id"
          @click="showConfirmModal = true"
        >
          Delete
        </button>
        <div class="flex gap-3">
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
      </div>
      <div class="flex w-full justify-end" v-if="isCancelled || isCompleted">
        <button class="btn-gray-outline" @click="onCancel">Back</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import AddressForm from '@/components/shared/AddressForm.vue'
import SelectStatusDropdown from '@/components/stock-transfer/SelectStatusDropdown.vue'
import AlertComponent from '@/components/shared/AlertComponent.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import IbrrSelectHeader from '@/components/stock-transfer/ibrr-select-header.vue'
import ProductSelectRow from '@/components/stock-transfer/ProductSelectRow.vue'
import { EventEnum } from '@/data/event'
import { ToastTypes } from '@/data/types'
import Event from '@/event'
import { InventoryConst, TransferConst } from '@/const/route.constants'
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
import { StockTransferCreateSchema } from 'shared/validators'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PageStateConst } from '@/const/state.constants'
import { useTableScroll } from '@/use/useTableScroll'
import { useValidation } from '@/composables/useValidation'
import { useAuth } from '@/composables/useAuth'

const ibrrEventName = 'ibrr-product-row'

const route = useRoute()
const isEdit = ref(false)
const router = useRouter()
const currentBranch = ref()
const appStore = useAppStore()
const showConfirmModal = ref(false)
const productStore = useProductStore()
const settingStore = useSettingsStore()
const transferStore = useTransferStore()

const productDefaultValue = {
  product_id: '',
  cost: '',
  quantity: '',
  amount: ''
}

const defaultValue = {
  transfer: {
    memo: '',
    str_id: '',
    branch_to: '',
    branch_from: '',
    processed_by: '',
    type: TransferType.IBRR,
    status: StockTransferStatus.OPEN,
    when: DateHelpers.formatDate(new Date(), 'YYYY-MM-DDTHH:II-A')
  },
  products: [{ ...productDefaultValue }]
}

const model = ref(ObjectHelpers.copyObj(defaultValue))

const address = ref({
  address1: '',
  address2: '',
  province: '',
  city: '',
  postal: ''
})

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

const totalAmount = computed(() => {
  const consumable = model.value.products
    .filter((p) => p.amount)
    .map((p) => parseInt(p.amount))
  return consumable.length ? consumable.reduce((a, b) => a + b) : 0
})

const isCompleted = computed(() => {
  return transferStore.transfer
    ? transferStore.transfer.status == StockTransferStatus.COMPLETED
    : false
})

const isCancelled = computed(() => {
  return transferStore.transfer
    ? transferStore.transfer.status == StockTransferStatus.CANCELLED
    : false
})

/** ================================================
 * METHODS
 ** ================================================*/
const timeInterval = setInterval(() => {
  model.value.transfer.when = DateHelpers.formatDate(
    new Date(),
    'YYYY-MM-DDTHH:II-A'
  )
}, 1000)

const populateAddress = () => {
  if (model.value.transfer.branch_from) {
    const branch = settingStore.branches.find(
      (b) => b.id == model.value.transfer.branch_from
    )

    if (branch) {
      address.value = ObjectHelpers.assignSameFields(
        address.value,
        branch.address
      )
    }
  }
}

const onSubmit = async (saveAndNew) => {
  clearInterval(timeInterval)

  // validate model
  validateData()

  if (hasErrors.value) {
    if (errors.value?.products) {
      Event.emit(ibrrEventName, errors.value.products)
    }
    return
  }

  let isSuccess = false
  if (!isEdit.value) isSuccess = await transferStore.createTransfer(model.value)
  else
    isSuccess = await transferStore.updateTransfer(model.value, route.query.id)

  if (isSuccess) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Successfully ${isEdit.value ? 'updated' : 'created'} IBRR!`,
      type: ToastTypes.SUCCESS
    })
    if (saveAndNew) {
      model.value = ObjectHelpers.copyObj(defaultValue)
      setCurrentBranch()
      await setProccessedBy()
    } else {
      if (!isEdit.value) {
        router.push({ name: TransferConst.IBRR_LIST })
      }
    }
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Failed to ${isEdit.value ? 'update' : 'create'} IBRR!`,
      type: ToastTypes.ERROR
    })
  }
}

const onCancel = () => {
  router.push({ name: TransferConst.IBRR_LIST })
}

const onAfterDelete = async () => {
  await transferStore.removeTransfer(route.query.id)
  router.push({ name: TransferConst.IBRR_LIST })
}

const setCurrentBranch = () => {
  currentBranch.value = appStore.currentBranch
  if (currentBranch.value) {
    model.value.transfer.branch_to = currentBranch.value.id
  }
}

const setProccessedBy = async () => {
  const user = await getAuthUser()
  model.value.transfer.processed_by = user?.id
}

const setIBRRFormPageState = () => {
  appStore.setPageState(PageStateConst.IBRR_FORM, {
    route_scope: [TransferConst.IBRR_FORM, InventoryConst.PRODUCT_FORM],
    state: model.value
  })
}

const multiSelectTableWrap = ref(null)
useTableScroll(multiSelectTableWrap)
/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await settingStore.getBranches()
  await productStore.getProducts()

  // check if route has transfer id
  if (route.query.id) {
    const transfer = await transferStore.getById(route.query.id)

    if (transfer) {
      model.value.transfer = ObjectHelpers.assignSameFields(
        model.value.transfer,
        transfer
      )

      // custom modification
      model.value.transfer.when = DateHelpers.formatDate(
        new Date(),
        'YYYY-MM-DDTHH:II:SS-A'
      )

      // populate products
      model.value.products = transfer.products.map((p) => {
        return {
          product_id: p.StockTransferProducts.product_id,
          description: p.StockTransferProducts.description,
          cost: p.StockTransferProducts.cost,
          quantity: p.StockTransferProducts.quantity,
          amount: p.StockTransferProducts.amount
        }
      })
    }
    isEdit.value = true
  }

  // set current branch
  setCurrentBranch()

  // set proccessed by
  await setProccessedBy()

  // set page state
  if (appStore.isPageExist(PageStateConst.IBRR_FORM)) {
    if (
      !ObjectHelpers.compareObjects(
        model.value,
        appStore.pages[PageStateConst.IBRR_FORM].state
      )
    ) {
      model.value = ObjectHelpers.assignSameFields(
        model.value,
        appStore.pages[PageStateConst.IBRR_FORM].state
      )
    }
  } else {
    setIBRRFormPageState()
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

onBeforeUnmount(() => {
  // clear interval
  clearInterval(timeInterval)
})

/** ================================================
 * WATCHERS
 ** ================================================*/
watch(
  () => model.value,
  () => {
    setIBRRFormPageState()

    if (model.value.transfer.branch_from) {
      populateAddress()
    }
  },
  { deep: true }
)
</script>
