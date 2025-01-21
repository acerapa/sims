<template>
  <ModalWrapper :title="title" v-model="showModal" @submit="onSubmit">
    <div class="flex flex-col py-6 gap-4">
      <div class="flex gap-3">
        <CustomInput
          type="text"
          class="flex-1"
          :has-label="true"
          name="service_name"
          label="Service Name"
          placeholder="Service Name"
          v-model="model.service.name"
        />
        <CustomInput
          type="number"
          label="Price"
          class="flex-1"
          :has-label="true"
          placeholder="Price"
          name="service_price"
          v-model="model.service.price"
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
          :options="incomeAccountOptions"
          placeholder="Select Income Account"
          v-model="model.service.income_account"
        />
        <CustomInput
          type="select"
          class="flex-1"
          :has-label="true"
          :has-add-new="true"
          name="expense_account"
          label="Expense Account"
          :options="expenseAccountOptions"
          placeholder="Select Expense Account"
          v-model="model.service.expense_account"
        />
      </div>
      <CustomInput
        :rows="6"
        type="textarea"
        :has-label="true"
        name="description"
        label="Description"
        placeholder="Description"
        v-model="model.details.description"
      />
    </div>
  </ModalWrapper>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import CustomInput from '../shared/CustomInput.vue'
import ModalWrapper from '../shared/ModalWrapper.vue'
import { AccountTypes, ProductType } from 'shared'
import { useSettingsStore } from '@/stores/settings'
import { useServiceStore } from '@/stores/services'

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
  const isSuccess = await serviceStore.registerService(model.value)

  if (isSuccess) {
    showModal.value = false
  }
}

onMounted(async () => {
  await settingStore.getAccounts()
})
</script>
