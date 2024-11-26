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
          :error="modelErrors.username"
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
          :error="modelErrors.status"
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
          :error="modelErrors.first_name"
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
          :error="modelErrors.middle_name"
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
          :error="modelErrors.last_name"
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
          :error="modelErrors.position"
          :error-has-text="true"
          label="Position"
          :has-label="true"
        />
        <CustomInput
          type="date"
          class="flex-1"
          name="date_started"
          placeholder="Date Started"
          v-model="model.date_started"
          :error="modelErrors.date_started"
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
import { Method, authenticatedApi } from '@/api'
import DeleteConfirmModal from '../DeleteConfirmModal.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import { useEmployeeStore } from '@/stores/employee'
import { ObjectHelpers } from 'shared'
import { computed, onMounted, ref } from 'vue'
import { UserSchema } from 'shared/validators/user'

const showConfirmModal = ref(false)

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const apiPath = props.selectedId
  ? `users/${props.selectedId}/update`
  : 'users/register'
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

const modelErrors = ref({})

const showModal = defineModel()

/** ================================================
 * COMPUTED
 ** ================================================*/
const positionOptions = computed(() => {
  return [
    { text: 'Admin', value: 'admin' },
    { text: 'Inventory Manager', value: 'inventory' },
    { text: 'Cashier', value: 'cashier' }
  ]
})

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async () => {
  // validator
  const { error } = UserSchema.validate(model.value, {
    abortEarly: false
  })

  if (!props.selectedId) {
    model.value.password = `${model.value.username}-${new Date().getFullYear()}`
  }

  if (error) {
    error.details.forEach((err) => {
      modelErrors.value[err.context.key] = err.message
    })
    return
  }
  const res = await authenticatedApi(apiPath, Method.POST, model.value)
  // TODO: Show alert. Currently we have no alert component so go ahead and create it first
  showModal.value = false
  // Refetch the updated data from database via store
  await employeeStore.fetchAllEmployees()
}

const onDelete = async () => {
  showConfirmModal.value = true
}

const onAfterDelete = async () => {
  showModal.value = false
  showConfirmModal.value = false
  await employeeStore.fetchAllEmployees()
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(() => {
  if (props.selectedId) {
    const employee = employeeStore.employees.find(
      (emp) => emp.id == props.selectedId
    )
    if (employee) {
      model.value = ObjectHelpers.assignSameFields(model.value, employee)

      // update date
      model.value.date_started = model.value.date_started.split('T')[0]
    }
  } else {
    model.value = ObjectHelpers.objectReset(model.value)
  }
})
</script>
