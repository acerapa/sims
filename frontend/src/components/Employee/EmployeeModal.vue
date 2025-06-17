<template>
  <ModalWrapper
    :title="props.selectedId ? 'Edit Employee' : 'Add Employee'"
    v-model="showModal"
    @submit="onSubmit"
    :has-delete="props.selectedId ? true : false"
    @delete="onDelete"
  >
    <div class="flex flex-col gap-6 mt-10">
      <div class="flex gap-3">
        <CustomInput
          type="text"
          name="username"
          class="flex-1"
          v-model="model.username"
          placeholder="Username"
          :error="errors.username"
          :error-has-text="true"
          label="Username"
          :has-label="true"
        />
        <CustomInput
          class="flex-1"
          name="status"
          type="select"
          :options="[
            { text: 'Active', value: 1 },
            { text: 'Inactive', value: 0 }
          ]"
          placeholder="Status"
          v-model="model.status"
          :error="errors.status"
          :error-has-text="true"
          label="Status"
          :has-label="true"
        />
      </div>
      <div class="grid grid-cols-3 gap-3">
        <CustomInput
          type="text"
          class="flex-1"
          name="first_name"
          placeholder="First Name"
          v-model="model.first_name"
          :error="errors.first_name"
          :error-has-text="true"
          label="First Name"
          :has-label="true"
        />
        <CustomInput
          type="text"
          name="middle_name"
          class="flex-1"
          placeholder="Middle Name"
          v-model="model.middle_name"
          :error="errors.middle_name"
          :error-has-text="true"
          label="Middle Name"
          :has-label="true"
        />
        <CustomInput
          name="last_name"
          type="text"
          class="flex-1"
          placeholder="Last Name"
          v-model="model.last_name"
          :error="errors.last_name"
          :error-has-text="true"
          label="Last Name"
          :has-label="true"
        />
      </div>
      <div class="flex gap-3">
        <CustomInput
          type="select"
          class="flex-1"
          name="position"
          placeholder="Select Position"
          v-model="model.position"
          :options="positionOptions"
          :error="errors.position"
          :error-has-text="true"
          label="Position"
          :has-label="true"
          :disabled="props.position ? true : false"
        />
        <CustomInput
          type="date"
          class="flex-1"
          name="date_started"
          placeholder="Date Started"
          v-model="model.date_started"
          :error="errors.date_started"
          :error-has-text="true"
          label="Date Started"
          :has-label="true"
        />
      </div>
      <div class="flex gap-3"></div>
    </div>
  </ModalWrapper>
  <DeleteConfirmModal
    v-if="showConfirmModal"
    v-model="showConfirmModal"
    :href="`users/delete/${props.selectedId}`"
    @after-delete="onAfterDelete"
  />
</template>
<script setup>
import DeleteConfirmModal from '../DeleteConfirmModal.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import { useEmployeeStore } from '@/stores/employee'
import { ObjectHelpers, ValidatorHelpers, UserSchema, UserType } from 'shared'
import { computed, onMounted, ref } from 'vue'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { ToastTypes } from '@/data/types'
import { useValidation } from '@/composables/useValidation'

const showConfirmModal = ref(false)

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  },
  position: {
    type: String,
    required: false
  }
})

const employeeStore = useEmployeeStore()

const model = ref({
  username: '',
  status: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  position: '',
  date_started: '',
  password: ''
})

const showModal = defineModel()
const id = defineModel('id')

// modify schema
const schema = props.selectedId
  ? ValidatorHelpers.makeSchemaFieldOptional(UserSchema)
  : UserSchema

const { errors, hasErrors, validateData } = useValidation(schema, model.value)

/** ================================================
 * COMPUTED
 ** ================================================*/
const positionOptions = computed(() => {
  return [
    { text: 'Admin', value: UserType.ADMIN },
    { text: 'Manager', value: UserType.MANAGER },
    { text: 'Inventory Manager', value: UserType.INVENTORY },
    { text: 'Cashier', value: UserType.CASHIER },
    { text: 'Sales Man', value: UserType.SALES_MAN }
  ]
})

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async () => {
  // validator
  if (!props.selectedId) {
    model.value.password = `${model.value.username}-${new Date().getFullYear()}`
  }

  validateData()
  if (hasErrors.value) return

  let isSuccess = false
  if (props.selectedId) {
    isSuccess = await employeeStore.updateEmployee(
      props.selectedId,
      model.value
    )
  } else {
    let res = await employeeStore.registerEmployee(model.value)
    isSuccess = res.isSuccess
    id.value = res.data.id
  }

  if (isSuccess) {
    showModal.value = false
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.SUCCESS,
      message: `Employee ${
        props.selectedId ? 'updated' : 'created'
      } successfully`,
      duration: 2000
    })
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.ERROR,
      message: `Failed to ${props.selectedId ? 'update' : 'created'} employee`,
      duration: 2000
    })
  }
}

const onDelete = async () => {
  showConfirmModal.value = true
}

const onAfterDelete = async () => {
  await employeeStore.removeEmployee(props.selectedId)

  showModal.value = false
  showConfirmModal.value = false
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(() => {
  // Mapping values from props to model, This are presets
  if (props.position) {
    model.value.position = props.position
  }

  if (props.selectedId) {
    const employee = employeeStore.employees.find(
      (emp) => emp.id == props.selectedId
    )
    if (employee) {
      model.value = ObjectHelpers.assignSameFields(model.value, employee)

      // update date
      model.value.date_started = model.value.date_started.split('T')[0]
    }
  }
})
</script>
