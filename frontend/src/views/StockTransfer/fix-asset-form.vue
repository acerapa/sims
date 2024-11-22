<template>
  <DeleteConfirmModal
    v-model="showConfirmModal"
    v-if="showConfirmModal"
    :href="``"
  />
  <div class="cont">
    <p class="text-base font-bold">Fix asset form</p>
    <div class="flex flex-col gap-3">
      <div class="mt-3 flex gap-3">
        <CustomInput
          name="po_no"
          placeholder="Ex. 123"
          :has-label="true"
          label="PO no."
          type="text"
          v-model="model.transfer.po_no"
        />
        <CustomInput
          name="when"
          :has-label="true"
          label="When"
          type="datetime-local"
          v-model="model.transfer.when"
          :disabled="true"
        />
      </div>
      <CustomInput
        type="textarea"
        name="memo"
        :has-label="true"
        label="Memo"
        placeholder="Ex. This is a descriptions"
        class="w-[calc(50%_-_6px)]"
        v-model="model.transfer.memo"
      />
    </div>

    <div class="flex flex-col gap-3 mt-8">
      <p class="text-base font-semibold">Select Product</p>
      <ProductMultiSelectTable
        v-model="model.products"
        :format="productDefaultValue"
        :row-component="ProductSelectRow"
        :header-component="ProductSelectHeader"
      >
      </ProductMultiSelectTable>

      <div
        class="flex gap-3"
        :class="route.query.id ? 'justify-between' : 'justify-end'"
      >
        <button class="btn-danger-outline" v-if="route.query.id">Delete</button>
        <div class="flex gap-3">
          <button class="btn-gray-outline" @click="onCancel">Cancel</button>
          <button class="btn-outline" v-if="!route.query.id">
            Save and New
          </button>
          <button class="btn" @click="onSubmit">
            {{ route.query.id ? 'Update' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import ProductSelectRow from '@/components/stock-transfer/ProductSelectRow.vue'
import ProductSelectHeader from '@/components/stock-transfer/ProductSelectHeader.vue'
import ProductMultiSelectTable from '@/components/shared/ProductMultiSelectTable.vue'
import { usePurchaseOrderStore } from '@/stores/purchase-order'
import { TransferType } from 'shared/enums'
import { DateHelpers, ObjectHelpers } from 'shared/helpers'
import { onMounted, ref } from 'vue'
import { useTransferStore } from '@/stores/transfer'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'

const productDefaultValue = {
  product_id: '',
  description: '',
  quantity: '',
  cost: '',
  amount: ''
}

const defaultValue = {
  transfer: {
    memo: '',
    po_no: '',
    branch_to: '',
    processed_by: '',
    type: TransferType.FIX,
    when: DateHelpers.formatDate(new Date(), 'YYYY-MM-DDTHH:II-A')
  },
  products: [{ ...productDefaultValue }]
}

const route = useRoute()
const currentBranch = ref()
const appStore = useAppStore()
const authStore = useAuthStore()
const showConfirmModal = ref(false)
const settingStore = useSettingsStore()
const transferStore = useTransferStore()
const purchaseOrderStore = usePurchaseOrderStore()

const authUser = ref()
const router = useRouter()
const model = ref({ ...defaultValue })

onMounted(async () => {
  await purchaseOrderStore.fetchPurchaseOrders()

  await settingStore.getBranches()
  authUser.value = await authStore.getAuthUser()
  currentBranch.value = appStore.currentBranch.id

  if (route.query.id) {
    const transfer = await transferStore.getById(route.query.id)
    model.value.transfer = ObjectHelpers.assignSameFields(
      model.value.transfer,
      transfer
    )

    // small modifications
    model.value.transfer.when = DateHelpers.formatDate(
      new Date(transfer.when),
      'YYYY-MM-DDTHH:II-A'
    )

    // products
    model.value.products = transfer.products.map((p) => {
      return ObjectHelpers.assignSameFields(
        { ...productDefaultValue },
        p.ProductTransaction
      )
    })
  }
})

const onSubmit = async (isAddNew = false) => {
  if (!route.query.id && authUser.value) {
    model.value.transfer.processed_by = authUser.value.id
    model.value.transfer.branch_to = currentBranch.value

    await transferStore.createTransfer(model.value)
  } else {
    await transferStore.updateTransfer(model.value, route.query.id)
  }

  if (!isAddNew) {
    router.push({
      name: 'fix-asset-list'
    })

    return
  }
}

const onCancel = () => {
  router.back()
}
</script>
