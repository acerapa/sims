<template>
  <ModalWrapper
    :title="title"
    v-model="showModal"
    @submit="onSubmit"
    @delete="showDeleteModal = true"
    :has-delete="(props, selectedId ? true : false)"
  >
    <div class="flex flex-col py-6 gap-4">
      <div class="flex gap-3">
        <CustomInput
          type="text"
          class="flex-1"
          :has-label="true"
          name="service_name"
          label="Service Name"
          :error-has-text="true"
          placeholder="Service Name"
          v-model="model.service.name"
          :error="errors.service?.name"
        />
        <CustomInput
          type="number"
          label="Price"
          class="flex-1"
          :has-label="true"
          placeholder="Price"
          name="service_price"
          :error-has-text="true"
          v-model="model.service.price"
          :error="errors.service?.price"
        />
      </div>
      <div class="flex gap-3">
        <CustomInput
          type="select"
          class="flex-1"
          :has-label="true"
          :has-add-new="true"
          name="income_account"
          label="Income Account"
          :error-has-text="true"
          :options="incomeAccountOptions"
          placeholder="Select Income Account"
          v-model="model.service.income_account"
          :error="errors.service?.income_account"
        />
        <CustomInput
          type="select"
          class="flex-1"
          :has-label="true"
          :has-add-new="true"
          name="expense_account"
          :error-has-text="true"
          label="Expense Account"
          :options="expenseAccountOptions"
          placeholder="Select Expense Account"
          v-model="model.service.expense_account"
          :error="errors.service?.expense_account"
        />
      </div>
      <CustomInput
        :rows="6"
        type="textarea"
        :has-label="true"
        name="description"
        label="Description"
        :error-has-text="true"
        placeholder="Description"
        v-model="model.details.description"
        :error="errors.details?.description"
      />
    </div>
  </ModalWrapper>
  <DeleteConfirmModal
    v-model="showDeleteModal"
    :href="`services/${props.selectedId}`"
    v-if="showDeleteModal && props.selectedId"
    @after-delete="onAfterDelete"
  />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import CustomInput from '../shared/CustomInput.vue'
import ModalWrapper from '../shared/ModalWrapper.vue'
import DeleteConfirmModal from '../DeleteConfirmModal.vue'
import {
  AccountTypes,
  ObjectHelpers,
  ProductType,
  ServiceItemSchema
} from 'shared'
import { useSettingsStore } from '@/stores/settings'
import { useServiceStore } from '@/stores/services'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { ToastTypes } from '@/data/types'
import { useValidation } from '@/composables/useValidation'

const showDeleteModal = ref(false)

const settingStore = useSettingsStore()
const serviceStore = useServiceStore()

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const title = props.selectedId ? 'Edit Services' : 'New Services'

const showModal = defineModel()

const model = ref({
  service: {
    name: '',
    price: '',
    type: ProductType.NON_INVENTORY,
    income_account: '',
    expense_account: ''
  },
  details: {
    description: ''
  }
})

// composables
const { errors, validateData, hasErrors } = useValidation(
  ServiceItemSchema,
  model.value
)

/** ================================================
 * COMPUTED
 ** ================================================*/

const incomeAccountOptions = computed(() => {
  return settingStore.accounts
    .filter((account) => account.type == AccountTypes.INCOME)
    .map((account) => {
      return {
        value: account.id,
        text: account.name
      }
    })
})

const expenseAccountOptions = computed(() => {
  return settingStore.accounts
    .filter((account) => account.type == AccountTypes.EXPENSE)
    .map((account) => {
      return {
        value: account.id,
        text: account.name
      }
    })
})

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async () => {
  // validate data
  validateData()

  if (hasErrors.value) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.ERROR,
      message: 'Some fields are not properly inputed please check!'
    })
    return
  }

  let isSuccess = false
  if (props.selectedId) {
    isSuccess = await serviceStore.updateService(props.selectedId, model.value)
  } else {
    isSuccess = await serviceStore.registerService(model.value)
  }

  if (isSuccess) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.SUCCESS,
      message: `Successfully ${props.selectedId ? 'updated' : 'created'} service!`,
      duration: 5000
    })
    showModal.value = false
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.ERROR,
      message: `Failed to ${props.selectedId ? 'updated' : 'created'} service!`,
      duration: 4000
    })
  }
}

const onAfterDelete = async () => {
  await serviceStore.removeService(props.selectedId)
  showDeleteModal.value = false
  showModal.value = false
}

onMounted(async () => {
  await settingStore.getAccounts()

  if (props.selectedId) {
    const service = await serviceStore.getService(props.selectedId)
    model.value.service = ObjectHelpers.assignSameFields(
      model.value.service,
      service
    )
    model.value.details = ObjectHelpers.assignSameFields(
      model.value.details,
      service.service_details
    )
  }
})
</script>
