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
          :error="modelErrors.first_name"
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
          :error="modelErrors.last_name"
          v-model="model.last_name"
        />
      </div>

      <p class="font-semibold mt-5">Address Information</p>
      <AddressForm
        class="mt-3"
        v-model="model.address"
        :address-errors="modelErrors.address"
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
  }
}

const model = ref(defaultModel)
const modelErrors = ref({
  address: {}
})

const onSubmit = async () => {
  let res = false

  // validate model
  const validateCustomer = CustomerSchema.options({
    allowUnknown: true
  }).validate(model.value, { abortEarly: false })

  if (validateCustomer.error) {
    validateCustomer.error.details.forEach((error) => {
      modelErrors.value[error.context.key] = error.message
    })

    return
  }

  if (!props.selectedId) {
    res = await customerStore.createCustomer(model.value)
  } else {
    res = await customerStore.updateCustomer(props.selectedId, model.value)
  }

  if (res) {
    showModal.value = false
    await customerStore.fetchCustomers()
  }
}

const onAfterDelete = async () => {
  showModal.value = false
  await customerStore.fetchCustomers()
}

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
    }
  }
})
</script>
