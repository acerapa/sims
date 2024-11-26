<template>
  <ModalWrapper
    title="New Account"
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
        :error="modelErrors.name"
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
        :error="modelErrors.type"
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
import { Method, authenticatedApi } from '@/api'
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import DeleteConfirmModal from '../DeleteConfirmModal.vue'
import { useSettingsStore } from '@/stores/settings'
import { onMounted, ref } from 'vue'
import CustomInput from '../shared/CustomInput.vue'
import { AccountSchema } from 'shared/validators/account'

const showConfirmModal = ref(false)
const settingsStore = useSettingsStore()
const model = ref({
  name: '',
  type: ''
})

const modelErrors = ref({})

const props = defineProps({
  selectedId: {
    type: Number
  }
})

const showModal = defineModel()

const apiPath = props.selectedId
  ? 'settings/accounts/update'
  : 'settings/accounts/register'

onMounted(() => {
  if (props.selectedId && props.selectedId) {
    model.value = settingsStore.accounts.find(
      (acc) => acc.id == props.selectedId
    )
  }
})

const onSubmit = async () => {
  // validation
  const { error } = AccountSchema.validate(model.value, { abortEarly: false })
  if (error) {
    error.details.forEach((err) => {
      modelErrors.value[err.context.key] = err.message
    })

    return
  }

  const res = await authenticatedApi(apiPath, Method.POST, model.value)
  showModal.value = false

  await settingsStore.fetchAllAccounts()
  if (res.status == 200) {
    showModal.value = false
  }
}

const onDelete = async () => {
  showConfirmModal.value = true
}

const onAfterDelete = async () => {
  showModal.value = false
  showConfirmModal.value = false
  await settingsStore.fetchAllAccounts()
}
</script>
