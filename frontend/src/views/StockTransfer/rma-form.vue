<template>
  <DeleteConfirmModal
    v-if="showConfirmModal && route.query.id"
    v-model="showConfirmModal"
    :href="`stock-transfer/${route.query.id}`"
    @after-delete="onAfterDelete"
  />
  <div class="cont flex flex-col gap-6">
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
            @change="populateAddress"
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
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import RmaProductSelectRow from '@/components/stock-transfer/RmaProductSelectRow.vue'
import RmaProductSelectHeader from '@/components/stock-transfer/RmaProductSelectHeader.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import { useVendorStore } from '@/stores/supplier'
import { computed, onMounted, ref } from 'vue'
import { DateHelpers, ObjectHelpers } from 'shared/helpers'
import { TransferType } from 'shared/enums'
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
    type: TransferType.RMA
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

  if (!isEdit.value) {
    model.value.transfer.when = new Date()
    const res = await transferStore.createTransfer(model.value)
    if (res.status == 200) {
      router.push({
        name: 'rma-list'
      })
    }
  } else {
    await transferStore.updateTransfer(model.value, route.query.id)
  }
}

const onCancel = () => {
  router.back()
}

const onAfterDelete = () => {
  router.push({
    name: 'rma-list'
  })
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await vendorStore.fetchAllSuppliers()
  await settingsStore.getBranches()
  currentBranch.value = appStore.currentBranch

  model.value.transfer.branch_from = currentBranch.value.id
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
      populateAddress()

      model.value.products = rma.products.map((p) => {
        return {
          product_id: p.ProductTransaction.product_id,
          description: p.ProductTransaction.description,
          quantity: p.ProductTransaction.quantity,
          cost: p.ProductTransaction.cost,
          amount: p.ProductTransaction.amount,
          problem: p.ProductTransaction.problem,
          serial_number: p.ProductTransaction.serial_number
        }
      })
    } else {
      console.log('RMA not found')
    }

    isEdit.value = true
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
