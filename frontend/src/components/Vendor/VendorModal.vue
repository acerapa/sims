<template>
  <ModalWrapper
    :title="title"
    v-model="showModal"
    @submit="onSubmit"
    @delete="showDeleteConfirmModal = true"
    :has-delete="props.selectedId ? true : false"
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
            :error="errors.vendor?.company_name"
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
            :error="errors.vendor?.annotation"
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
            :error="errors.vendor?.first_name"
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
            :error="errors.vendor?.last_name"
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
            :error="errors.vendor?.phone"
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
            :error="errors.vendor?.telephone"
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
            :error="errors.vendor?.email"
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
            :error="errors.vendor?.fax"
            v-model="model.vendor.fax"
          />
        </div>
        <CustomInput
          type="text"
          :has-label="true"
          name="fb_profile"
          class="w-[50%-12px]"
          :error-has-text="true"
          :error="errors.vendor?.fb_profile"
          v-model="model.vendor.fb_profile"
          label="Facebook\Messenger Profile"
          placeholder="Facebook/Messenger Profile"
        />
      </div>

      <div class="flex flex-col gap-3">
        <p class="text-base font-semibold">Address Info</p>
        <AddressForm
          :has-label="true"
          v-model="model.address"
          :address-errors="errors"
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
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import AddressForm from '../shared/AddressForm.vue'
import { useVendorStore } from '@/stores/supplier'
import { onMounted, ref } from 'vue'
import { VendorCreateSchema } from 'shared'
import { ObjectHelpers } from 'shared'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { ToastTypes } from '@/data/types'
import { useValidation } from '@/composables/useValidation'

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

const model = ref({
  vendor: {
    company_name: '',
    first_name: '',
    last_name: '',
    annotation: '',
    phone: '',
    email: '',
    telephone: '',
    fax: '',
    fb_profile: ''
  },
  address: {
    address1: '',
    address2: '',
    city: '',
    province: '',
    postal: ''
  }
})

// composables
const { errors, hasErrors, validateData } = useValidation(
  VendorCreateSchema,
  model.value
)

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async () => {
  // validation
  validateData()
  if (hasErrors.value) return

  let isSuccess = false
  if (props.selectedId) {
    isSuccess = await supplierStore.updateSupplier(
      props.selectedId,
      model.value
    )
  } else {
    isSuccess = await supplierStore.registerSupplier(model.value)
  }

  if (isSuccess) {
    showModal.value = false
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Successfully ${props.selectedId ? 'updated' : 'created'} Vendor/Supplier!`,
      type: ToastTypes.SUCCESS,
      duration: 2000
    })
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Failed to ${props.selectedId ? 'update' : 'create'} Vendor/Supplier!`,
      type: ToastTypes.ERROR,
      duration: 2000
    })
  }
}

const onAfterDelete = async () => {
  showModal.value = false
  await supplierStore.removeSupplier(props.selectedId)
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
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
