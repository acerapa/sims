<template>
  <ModalWrapper
    @submit="onSubmit"
    v-model="showModal"
    @delete="showDeleteConfirmModal = true"
    :has-delete="props.selectedId ? true : false"
    :save-btn="props.selectedId ? 'Update' : 'Save'"
    :title="props.selectedId ? 'Edit Customer' : 'New Customer'"
  >
    <div class="my-7">
      <p class="font-semibold">Personal Information</p>
      <div class="flex gap-3 mt-3">
        <CustomInput
          type="text"
          class="flex-1"
          :has-label="true"
          label="First Name"
          name="first_name"
          placeholder="First Name"
          :error-has-text="true"
          :error="errors.first_name"
          v-model="model.first_name"
        />
        <CustomInput
          type="text"
          class="flex-1"
          :has-label="true"
          label="Last Name"
          name="last_name"
          placeholder="Last Name"
          :error-has-text="true"
          :error="errors.last_name"
          v-model="model.last_name"
        />
      </div>

      <p class="font-semibold mt-5">Address Information</p>
      <AddressForm
        class="mt-3"
        v-model="model.address"
        :address-errors="errors.address"
      />

      <p class="font-semibold mt-5">Contact Information</p>
      <div class="flex gap-3 mt-3">
        <CustomInput
          type="text"
          class="flex-1"
          :has-label="true"
          label="Phone Number"
          name="phone_number"
          placeholder="Phone Number"
          :error-has-text="true"
          :error="errors.phone_number"
          v-model="model.phone_number"
        />
        <CustomInput
          type="text"
          class="flex-1"
          :has-label="true"
          label="Viber"
          name="viber"
          placeholder="Viber"
          :error-has-text="true"
          :error="errors.viber"
          v-model="model.viber"
        />
      </div>
      <CustomInput
        type="text"
        class="flex-1 mt-3"
        :has-label="true"
        label="Facebook"
        name="facebook_url"
        placeholder="Facebook"
        :error-has-text="true"
        :error="errors.facebook_url"
        v-model="model.facebook_url"
      />
    </div>
  </ModalWrapper>
  <DeleteConfirmModal
    v-model="showDeleteConfirmModal"
    v-if="showDeleteConfirmModal && props.selectedId"
    :href="`customers/${props.selectedId}/delete`"
    @after-delete="onAfterDelete"
  />
</template>

<script setup>
import CustomInput from '../shared/CustomInput.vue'
import AddressForm from '../shared/AddressForm.vue'
import ModalWrapper from '../shared/ModalWrapper.vue'
import DeleteConfirmModal from '../DeleteConfirmModal.vue'
import { onMounted, ref } from 'vue'
import { useCustomerStore } from '@/stores/customer'
import { CustomerSchema, ObjectHelpers } from 'shared'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { ToastTypes } from '@/data/types'
import { useValidation } from '@/composables/useValidation'

const showModal = defineModel()
const showDeleteConfirmModal = ref(false)

const customerStore = useCustomerStore()

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const defaultModel = {
  first_name: '',
  last_name: '',
  address: {
    address1: '',
    address2: '',
    city: '',
    province: '',
    postal: ''
  },
  phone_number: '',
  facebook_url: '',
  viber: ''
}

const model = ref(defaultModel)

// composables
const { errors, hasErrors, validateData } = useValidation(
  CustomerSchema,
  model.value
)

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async () => {
  validateData()
  if (hasErrors.value) return

  let isSuccess = false

  if (!props.selectedId) {
    isSuccess = await customerStore.createCustomer(model.value)
  } else {
    isSuccess = await customerStore.updateCustomer(
      props.selectedId,
      model.value
    )
  }

  if (isSuccess) {
    showModal.value = false
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Successfully ${props.selectedId ? 'updated' : 'created'} Customer!`,
      type: ToastTypes.SUCCESS,
      duration: 2000
    })
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Failed to ${props.selectedId ? 'update' : 'create'} Customer!`,
      type: ToastTypes.ERROR,
      duration: 2000
    })
  }
}

const onAfterDelete = async () => {
  showModal.value = false
  await customerStore.fetchCustomers()
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  if (props.selectedId) {
    await customerStore.getCustomer(props.selectedId)

    if (customerStore.customer) {
      model.value = ObjectHelpers.assignSameFields(
        model.value,
        customerStore.customer
      )
      model.value.address = ObjectHelpers.assignSameFields(
        model.value.address,
        customerStore.customer.address
      )

      delete model.value.address.id
    }
  }
})
</script>
