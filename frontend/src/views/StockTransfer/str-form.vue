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
    <div class="cont">
      <button type="button" class="btn float-right" @click="startPrint">
        &#128438; Print
      </button>
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
              :options="branchOptions"
              :has-label="true"
              label="Select Receiving Branch"
              placeholder="Select Branch"
              v-model="model.transfer.branch_to"
              @change="populateAddress"
              :error="modelErrors.branch_to"
              :error-has-text="true"
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
            :error="modelErrors.memo"
            :error-has-text="true"
          />
        </div>

        <div class="flex flex-col gap-3 flex-1">
          <p class="text-base font-semibold">Address Info</p>
          <AddressForm
            v-model="address"
            :has-label="true"
            :disabled="true"
            :address-errors="modelErrors"
          />
        </div>
      </div>
      <div class="flex flex-col gap-3 mt-5">
        <p class="text-base font-semibold">Select Product</p>
        <ProductMulitpleSelect
          v-model="model.products"
          :header-component="ProductSelectHeader"
          :row-component="ProductSelectRow"
          :format="productDefaultValue"
          :row-event-name="rowEventName"
        >
          <template v-slot:aggregate>
            <div>
              <span class="font-bold text-sm">Total: </span>
              <span class="text-sm"
                >&#8369; {{ totalAmount ? totalAmount : 0 }}</span
              >
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
          v-if="route.query.id"
        >
          Delete
        </button>
        <div class="flex gap-3">
          <button class="btn-gray-outline" @click="onCancel">Cancel</button>
          <button
            class="btn-outline disabled:opacity-50"
            :disabled="!currentBranch"
            v-if="!isEdit"
          >
            Save and New
          </button>
          <button
            class="btn disabled:opacity-50"
            @click="onSubmit"
            :disabled="!currentBranch"
          >
            {{ isEdit ? 'Update' : 'Save' }}
          </button>
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
import ProductSelectRow from '@/components/stock-transfer/ProductSelectRow.vue'
import ProductMulitpleSelect from '@/components/shared/MultiSelectTable.vue'
import ProductSelectHeader from '@/components/stock-transfer/ProductSelectHeader.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/product'
import { useSettingsStore } from '@/stores/settings'
import { useTransferStore } from '@/stores/transfer'
import { TransferType } from 'shared/enums'
import { DateHelpers, ObjectHelpers } from 'shared/helpers'
import { StockTransferCreateSchema } from 'shared'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { usePrint } from '@/use/usePrint'
import { ToastTypes } from '@/data/types'
import { TransferConst } from '@/router/constants/route.constants'

const rowEventName = 'str-product-row'

const route = useRoute()
const router = useRouter()
const isEdit = ref(false)
const appStore = useAppStore()
const authStore = useAuthStore()
const { startPrint } = usePrint()
const productStore = useProductStore()
const settingStore = useSettingsStore()
const transferStore = useTransferStore()

const productDefaultValue = {
  product_id: '',
  description: '',
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
    when: DateHelpers.formatDate(new Date(), 'YYYY-MM-DDTHH:II-A'),
    type: TransferType.STR
  },
  products: [{ ...productDefaultValue }]
}

const currentBranch = ref()
const modelErrors = ref({ products: [] })
const model = ref(defaultValue)
const showConfirmModal = ref(false)

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/
const totalAmount = computed(() => {
  return model.value.products.length
    ? model.value.products.map((p) => p.amount).reduce((a, b) => a + b)
    : 0
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

const onSubmit = async () => {
  clearInterval(timeInterval)

  // validate model
  const { error } = StockTransferCreateSchema.validate(model.value, {
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
      message: `Successfully ${isEdit.value ? 'updated' : 'created'} STR!`,
      type: ToastTypes.SUCCESS
    })
    if (!isEdit.value) {
      router.push({
        name: TransferConst.STR_LIST
      })
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

      // populate address from the receiver in the transfer
      populateAddress()

      // populate products
      model.value.products = transfer.products.map((p) => {
        return {
          product_id: p.StockTransferProducts.product_id,
          description: p.StockTransferProducts.description,
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
  currentBranch.value = appStore.currentBranch
  if (currentBranch.value) {
    model.value.transfer.branch_from = currentBranch.value.id
  }

  // set processed by
  model.value.transfer.processed_by = authStore.getAuthUser().id

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

onBeforeUnmount(() => {
  // remove interval
  clearInterval(timeInterval)
})
</script>
