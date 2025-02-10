<template>
  <div>
    <div
      class="grid gap-3 items-start min-w-[750px]"
      :class="[props.isDisabled ? 'grid grid-cols-10' : 'grid-cols-11']"
    >
      <div class="col-span-2 flex gap-3">
        <CustomInput
          type="checkbox"
          name="checkbox"
          v-if="!props.isDisabled"
          class="flex-shrink-0 mt-[10px]"
        />
        <CustomInput
          type="select"
          class="w-full"
          name="select_product"
          placeholder="Select product"
          :options="productStore.productOptions"
          :has-add-new="true"
          @add-new="onAddNewProduct"
          v-model="model.product_id"
          :can-search="true"
          :disabled="props.isDisabled"
          @change="onChange"
          :error-has-text="false"
          :error="modelErrors.product_id"
        />
      </div>
      <CustomInput
        class="col-span-2"
        type="text"
        name="serial_number"
        placeholder="Serial number"
        :disabled="props.isDisabled"
        v-model="model.serial_number"
        :error-has-text="false"
        :error="modelErrors.serial_number"
      />
      <CustomInput
        class="col-span-3"
        type="textarea"
        name="Problem"
        v-model="model.problem"
        :disabled="props.isDisabled"
        placeholder="Problem"
        :error-has-text="false"
        :error="modelErrors.problem"
      />
      <CustomInput
        class="col-span-1"
        type="number"
        name="quantity"
        placeholder="Quantity"
        :disabled="props.isDisabled"
        v-model="model.quantity"
        :error-has-text="false"
        :error="modelErrors.quantity"
      />
      <CustomInput
        class="col-span-1"
        type="number"
        name="cost"
        placeholder="Cost"
        :disabled="props.isDisabled"
        v-model="model.cost"
        :error-has-text="false"
        :error="modelErrors.cost"
      />
      <CustomInput
        class="col-span-1"
        type="number"
        name="amount"
        placeholder="Amount"
        :disabled="props.isDisabled"
        v-model="model.amount"
        :error-has-text="false"
        :error="modelErrors.amount"
      />
      <p
        class="col-span-1 text-sm pl-3 mt-[10px]"
        :class="[props.isDisabled ? 'hidden' : '']"
      >
        <img
          @click="emit('remove')"
          src="@/assets/icons/remove.svg"
          class="cursor-pointer w-5 h-5"
          alt="remove"
        />
      </p>
    </div>
  </div>
</template>

<script setup>
import { useProductStore } from '@/stores/product'
import CustomInput from '../shared/CustomInput.vue'
import { onMounted, ref, watch } from 'vue'
import Event from '@/event'
import { useRouter } from 'vue-router'
import { InventoryConst, TransferConst } from '@/const/route.constants'
const props = defineProps({
  ndx: {
    type: Number,
    required: true
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  eventName: {
    type: String,
    required: false
  }
})

const emit = defineEmits(['remove'])
const productStore = useProductStore()
const router = useRouter()
const model = defineModel()
const modelErrors = ref({})

Event.on(
  props.eventName,
  (data) => {
    if (typeof props.ndx != 'undefined') {
      modelErrors.value = data[props.ndx] ? data[props.ndx] : {}
    }
  },
  true
)

const onChange = () => {
  if (model.value.product_id) {
    const product = productStore.products.find(
      (prd) => prd.id == model.value.product_id
    )

    if (product) {
      model.value.description = product.purchase_description
      model.value.cost = product.price
      model.value.quantity = 1
      model.value.amount = 0
    }
  } else {
    model.value.serial_number = ''
    model.value.problem = ''
    model.value.product_id = ''
    model.value.description = ''
    model.value.quantity = ''
    model.value.cost = ''
  }
}

const onAddNewProduct = () => {
  router.push({
    name: InventoryConst.PRODUCT_FORM,
    query: {
      redirect: TransferConst.RMA_FORM
    }
  })
}

onMounted(async () => {
  if (productStore.productOptions.length === 0) {
    await productStore.fetchAllProducts()
  }
})

watch(
  () => [model.value.quantity, model.value.cost],
  () => {
    model.value.amount = model.value.quantity * model.value.cost
  }
)
</script>
