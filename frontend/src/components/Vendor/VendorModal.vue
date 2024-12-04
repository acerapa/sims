<template>
  <ModalWrapper
    :title="title"
    v-model="showModal"
    @submit="onSubmit"
    :has-delete="true"
    @delete="showDeleteConfirmModal = true"
    :save-btn="props.selectedId ? 'Update' : 'Save'"
  >
    <div class="flex flex-col gap-4 my-7">
      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Basic Info</p>
        <div class="flex gap-6">
          <CustomInput
            type="text"
            class="flex-1"
            name="company_name"
            placeholder="Company Name"
            :has-label="true"
            label="Company Name"
            :error-has-text="true"
            :error="modelErrors.company_name"
            v-model="model.vendor.company_name"
          />
          <CustomInput
            type="select"
            class="flex-1"
            name="annotation"
            :has-label="true"
            label="Annotation"
            :error-has-text="true"
            v-model="model.vendor.annotation"
            :error="modelErrors.annotation"
            placeholder="Select annotation"
            :options="[
              { text: 'Mr.', value: 'Mr.' },
              { text: 'Ms.', value: 'Ms.' },
              { text: 'Mrs.', value: 'Mrs.' }
            ]"
          />
        </div>
        <div class="flex gap-6">
          <CustomInput
            type="text"
            class="flex-1"
            name="first_name"
            :has-label="true"
            label="First Name"
            :error-has-text="true"
            placeholder="First Name"
            :error="modelErrors.first_name"
            v-model="model.vendor.first_name"
          />
          <CustomInput
            type="text"
            class="flex-1"
            name="last_name"
            :has-label="true"
            label="Last Name"
            :error-has-text="true"
            placeholder="Last Name"
            :error="modelErrors.last_name"
            v-model="model.vendor.last_name"
          />
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Contact Info</p>
        <div class="flex gap-6">
          <CustomInput
            type="text"
            name="phone"
            class="flex-1"
            label="Phone"
            :has-label="true"
            :error-has-text="true"
            :error="modelErrors.phone"
            placeholder="Mobile Number"
            v-model="model.vendor.phone"
          />
          <CustomInput
            type="text"
            class="flex-1"
            name="telephone"
            label="Telephone"
            :has-label="true"
            :error-has-text="true"
            placeholder="Telephone Number"
            :error="modelErrors.telephone"
            v-model="model.vendor.telephone"
          />
        </div>
        <div class="flex gap-6">
          <CustomInput
            type="text"
            name="email"
            class="flex-1"
            label="Email"
            :has-label="true"
            placeholder="Email"
            :error-has-text="true"
            :error="modelErrors.email"
            v-model="model.vendor.email"
          />
          <CustomInput
            name="fax"
            type="text"
            class="flex-1"
            label="Fax"
            :has-label="true"
            placeholder="Fax"
            :error-has-text="true"
            :error="modelErrors.fax"
            v-model="model.vendor.fax"
          />
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Address Info</p>
        <AddressForm
          :has-label="true"
          v-model="model.address"
          :address-errors="modelErrors"
        />
      </div>
    </div>
  </ModalWrapper>
  <DeleteConfirmModal
    v-model="showDeleteConfirmModal"
    v-if="showDeleteConfirmModal"
    :href="`suppliers/delete/${props.selectedId}`"
    @after-delete="onAfterDelete"
  />
</template>

<script setup>
import DeleteConfirmModal from '../DeleteConfirmModal.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import { Method, authenticatedApi } from '@/api'
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import AddressForm from '../shared/AddressForm.vue'
import { useVendorStore } from '@/stores/supplier'
import { onMounted, ref } from 'vue'
import { VendorCreateSchema } from 'shared/validators/vendor'
import { ObjectHelpers } from 'shared'

const showModal = defineModel()
const showDeleteConfirmModal = ref(false)

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const supplierStore = useVendorStore()
const title = ref(
  props.selectedId ? 'Edit Vendor/Supplier' : 'New Vendor/Supplier'
)
const apiPath = ref(
  props.selectedId
    ? `suppliers/${props.selectedId}/update`
    : 'suppliers/register'
)
const model = ref({
  vendor: {
    company_name: '',
    first_name: '',
    last_name: '',
    annotation: '',
    phone: '',
    email: '',
    telephone: '',
    fax: ''
  },
  address: {
    address1: '',
    address2: '',
    city: '',
    province: '',
    postal: ''
  }
})

const modelErrors = ref({})

const onSubmit = async () => {
  // validation
  const { error } = VendorCreateSchema.validate(model.value, {
    abortEarly: false
  })

  if (error) {
    error.details.forEach((err) => {
      modelErrors.value[err.context.key] = err.message
    })
    return
  }

  const res = await authenticatedApi(apiPath.value, Method.POST, model.value)
  await supplierStore.fetchAllSuppliers()

  if (props.selectedId) {
    await supplierStore.fetchSupplierById(props.selectedId)
  }

  if (res.status == 200) {
    showModal.value = false
  }
}

const onAfterDelete = async () => {
  showModal.value = false
  await supplierStore.fetchAllSuppliers()
}

onMounted(async () => {
  if (props.selectedId) {
    const supplier = await supplierStore.getSupplierById(props.selectedId)

    if (supplier) {
      model.value.vendor = ObjectHelpers.assignSameFields(
        model.value.vendor,
        supplier
      )
      model.value.address = ObjectHelpers.assignSameFields(
        model.value.address,
        supplier.address
      )
    }
  }
})
</script>
