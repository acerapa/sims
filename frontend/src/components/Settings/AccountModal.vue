<template>
  <ModalWrapper
    :title="props.selectedId ? 'Edit Account' : 'New Account'"
    @submit="onSubmit"
    v-model="showModal"
    :has-delete="props.selectedId ? true : false"
    @delete="onDelete"
  >
    <div class="flex gap-3 my-7">
      <CustomInput
        type="text"
        name="name"
        placeholder="Name"
        v-model="model.name"
        class="flex-1"
        :has-label="true"
        label="Name"
        :error="errors.name"
        :error-has-text="true"
      />
      <CustomInput
        type="select"
        name="select_account"
        v-model="model.type"
        class="flex-1"
        :has-label="true"
        label="Type"
        :options="[
          {
            text: 'Income Account',
            value: 'income'
          },
          {
            text: 'Expense Account',
            value: 'expense'
          },
          {
            text: 'Asset Account',
            value: 'asset'
          }
        ]"
        :error="errors.type"
        :error-has-text="true"
      />
    </div>
  </ModalWrapper>
  <DeleteConfirmModal
    v-model="showConfirmModal"
    v-if="showConfirmModal"
    :href="`settings/accounts/delete/${props.selectedId}`"
    @after-delete="onAfterDelete"
  />
</template>

<script setup>
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import DeleteConfirmModal from '../DeleteConfirmModal.vue'
import { useSettingsStore } from '@/stores/settings'
import { onMounted, ref } from 'vue'
import CustomInput from '../shared/CustomInput.vue'
import { AccountSchema } from 'shared/validators'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { ToastTypes } from '@/data/types'
import { useValidation } from '@/composables/useValidation'

const showConfirmModal = ref(false)
const settingsStore = useSettingsStore()
const model = ref({
  name: '',
  type: ''
})

// composables
const { errors, hasErrors, validateData } = useValidation(
  AccountSchema,
  model.value
)

const props = defineProps({
  selectedId: {
    type: Number
  }
})

const showModal = defineModel()

onMounted(() => {
  if (props.selectedId && props.selectedId) {
    model.value = settingsStore.accounts.find(
      (acc) => acc.id == props.selectedId
    )
  }
})

const onSubmit = async () => {
  // validation
  validateData()

  if (hasErrors.value) return

  let isSuccess = false
  if (props.selectedId) {
    isSuccess = await settingsStore.updateAccount(props.selectedId, model.value)
  } else {
    isSuccess = await settingsStore.createAccount(model.value)
  }

  if (isSuccess) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Successfully ${props.selectedId ? 'updated' : 'created'} account!`,
      type: ToastTypes.SUCCESS,
      duration: 2000
    })
    showModal.value = false
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Failed to ${props.selectedId ? 'update' : 'create'} account!`,
      type: ToastTypes.ERROR,
      duration: 2000
    })
  }
}

const onDelete = async () => {
  showConfirmModal.value = true
}

const onAfterDelete = async () => {
  showModal.value = false
  showConfirmModal.value = false
  await settingsStore.removeAccount(props.selectedId)
}
</script>
