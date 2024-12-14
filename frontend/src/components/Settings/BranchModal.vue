<template>
  <ModalWrapper
    :title="title"
    v-model="showModal"
    @submit="onSubmit"
    :has-delete="props.selectedId ? true : false"
    @delete="onDelete"
  >
    <div class="my-7 flex flex-col gap-3">
      <p class="text-sm font-semibold">Info</p>
      <div class="flex gap-3">
        <CustomInput
          type="text"
          class="flex-1"
          :has-label="true"
          name="branch_name"
          label="Branch Name"
          v-model="model.branch.name"
          placeholder="Ex. Masili Branch"
          :error="modelErrors.name"
          :error-has-text="true"
        />
        <CustomInput
          type="select"
          class="flex-1"
          :has-label="true"
          :has-add-new="true"
          name="branch_manager"
          label="Branch Manager"
          :options="employeeOptions"
          placeholder="Select Branch Manager"
          v-model="model.branch.branch_manager"
          @add-new="showEmployeeModal = true"
          :error="modelErrors.branch_manager"
          :error-has-text="true"
        />
      </div>

      <CustomInput
        type="select"
        name="status"
        label="Status"
        :has-label="true"
        :options="statusOptions"
        placeholder="Select status"
        v-model="model.branch.status"
        class="w-[calc(50%_-_0.5rem)]"
        :error="modelErrors.status"
        :error-has-text="true"
      />
      <CustomInput
        class="[&>div]:flex [&>div]:flex-row-reverse [&>div]:justify-end [&>div]:gap-3 mt-3"
        type="checkbox"
        name="is_current"
        label="Is current"
        :has-label="true"
        v-model="model.branch.is_current"
      />
    </div>
    <div class="my-7 flex flex-col gap-3">
      <p class="text-sm font-semibold">Address</p>
      <AddressForm
        :has-label="true"
        :key="model.address"
        v-model="model.address"
        :address="model.address"
        :address-errors="modelErrors"
      />
    </div>
  </ModalWrapper>
  <DeleteConfirmModal
    v-model="showConfirmModal"
    v-if="showConfirmModal"
    :href="`branch/delete/${props.selectedId}`"
    @after-delete="onAfterDelete"
  />
  <EmployeeModal v-if="showEmployeeModal" v-model="showEmployeeModal" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import DeleteConfirmModal from '../DeleteConfirmModal.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import { useEmployeeStore } from '@/stores/employee'
import EmployeeModal from '@/components/Employee/EmployeeModal.vue'
import { BranchStatusMap } from 'shared/enums'
import AddressForm from '@/components/shared/AddressForm.vue'
import { useSettingsStore } from '@/stores/settings'
import { ObjectHelpers } from 'shared/helpers'
import { useAppStore } from '@/stores/app'
import { BranchCreateSchema } from 'shared/validators'

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const showModal = defineModel()
const showConfirmModal = ref(false)
const showEmployeeModal = ref(false)
const currentBranch = ref({})
const appStore = useAppStore()
const settingStore = useSettingsStore()
const employeeStore = useEmployeeStore()

const title = props.selectedId ? 'Edit Branch' : 'New Branch'

const model = ref({
  branch: {
    name: '',
    status: '',
    is_current: false,
    branch_manager: ''
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
  // validations
  const { error } = BranchCreateSchema.validate(model.value, {
    abortEarly: false
  })

  if (error) {
    error.details.forEach((err) => {
      modelErrors.value[err.context.key] = err.message
    })
    return
  }

  let res = null
  if (!props.selectedId) {
    res = await settingStore.createBranch(model.value)
  } else {
    res = await settingStore.updateBranch(props.selectedId, model.value)
  }

  if (model.value.branch.is_current) {
    if (props.selectedId != currentBranch.value.id) {
      res = await settingStore.updateBranch(currentBranch.value.id, {
        branch: { is_current: false }
      })
    }
  }

  if (res.status < 400) {
    await settingStore.fetchAllBranches()
    showModal.value = false
  }
}

const onDelete = () => {
  showConfirmModal.value = true
}

const onAfterDelete = async () => {
  showModal.value = false
  await settingStore.fetchAllBranches()
}

const employeeOptions = computed(() => employeeStore.employeeOptions())
const statusOptions = computed(() =>
  Object.entries(BranchStatusMap).map((status) => {
    return {
      text: status[1].text,
      value: status[0]
    }
  })
)

onMounted(async () => {
  // TODO: Setup skeleton
  if (props.selectedId) {
    const branch = settingStore.branches.find(
      (branch) => branch.id == props.selectedId
    )

    if (branch) {
      model.value.branch = ObjectHelpers.assignSameFields(
        model.value.branch,
        branch
      )
      model.value.address = ObjectHelpers.assignSameFields(
        model.value.address,
        branch.address
      )
    }
  } else {
    model.value = ObjectHelpers.objectReset(model.value)
  }

  currentBranch.value = appStore.currentBranch
  await employeeStore.fetchAllEmployees()
})
</script>
