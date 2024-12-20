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

    <div class="cont flex flex-col gap-8">
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
              :error="modelErrors.str_id"
              v-model="model.transfer.str_id"
            />
            <CustomInput
              type="select"
              name="branch_to"
              class="flex-1"
              :has-label="true"
              label="From Branch"
              :error-has-text="true"
              :options="branchOptions"
              @change="populateAddress"
              placeholder="Select Branch"
              :error="modelErrors.branch_from"
              v-model="model.transfer.branch_from"
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
          />
        </div>
        <div class="flex-1">
          <p class="font-semibold">Branch Address Information</p>
          <AddressForm :has-label="true" v-model="address" :disabled="true" />
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <p class="font-semibold">Select Product</p>
        <ProductMultiSelectTable
          v-model="model.products"
          :header-component="IbrrSelectHeader"
          :row-component="ProductSelectRow"
          :format="productDefaultValue"
          :row-event-name="ibrrEventName"
        />
      </div>
      <div
        class="flex gap-3 mt-4"
        :class="route.query.id ? 'justify-between' : 'justify-end'"
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
import ProductMultiSelectTable from '@/components/shared/ProductMultiSelectTable.vue'
import IbrrSelectHeader from '@/components/stock-transfer/ibrr-select-header.vue'
import ProductSelectRow from '@/components/stock-transfer/ProductSelectRow.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/product'
import { useSettingsStore } from '@/stores/settings'
import { useTransferStore } from '@/stores/transfer'
import { TransferType } from 'shared/enums'
import { DateHelpers, ObjectHelpers } from 'shared/helpers'
import { StockTransferCreateSchema } from 'shared/validators'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const ibrrEventName = 'ibrr-product-row'

const route = useRoute()
const isEdit = ref(false)
const router = useRouter()
const currentBranch = ref()
const appStore = useAppStore()
const authStore = useAuthStore()
const showConfirmModal = ref(false)
const productStore = useProductStore()
const settingStore = useSettingsStore()
const transferStore = useTransferStore()

const productDefaultValue = {
  product_id: '',
  description: '',
  cost: '',
  quantity: '',
  amount: ''
}

const model = ref({
  transfer: {
    memo: '',
    str_id: '',
    branch_to: '',
    branch_from: '',
    processed_by: '',
    type: TransferType.IBRR,
    when: DateHelpers.formatDate(new Date(), 'YYYY-MM-DDTHH:II-A')
  },
  products: [{ ...productDefaultValue }]
})

const modelErrors = ref({})

const address = ref({
  address1: '',
  address2: '',
  province: '',
  city: '',
  postal: ''
})
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

    // trigger event to show error
    Event.emit(ibrrEventName, modelErrors.value.products)
    return
  }

  if (!isEdit.value) {
    await transferStore.createTransfer(model.value)
    router.push({ name: 'ibrr-list' })
  } else {
    await transferStore.updateTransfer(model.value, route.query.id)
  }
}

const onCancel = () => {
  router.push({ name: 'ibrr-list' })
}

const onAfterDelete = () => {
  router.push({ name: 'ibrr-list' })
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await settingStore.getBranches()
  await productStore.fetchAllProducts()

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

      // populate address
      populateAddress()

      // populate products
      model.value.products = transfer.products.map((p) => {
        return {
          product_id: p.ProductTransaction.product_id,
          description: p.ProductTransaction.description,
          cost: p.ProductTransaction.cost,
          quantity: p.ProductTransaction.quantity,
          amount: p.ProductTransaction.amount
        }
      })
    }
    isEdit.value = true
  }

  currentBranch.value = appStore.currentBranch
  if (currentBranch.value) {
    model.value.transfer.branch_to = currentBranch.value.id
  }

  model.value.transfer.processed_by = authStore.getAuthUser().id

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

onBeforeUnmount(() => {
  // clear interval
  clearInterval(timeInterval)
})
</script>
