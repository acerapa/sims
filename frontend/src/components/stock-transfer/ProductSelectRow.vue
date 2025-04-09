<template>
  <div>
    <slot></slot>
    <div
      class="grid gap-3 items-start min-w-[1033px]"
      :class="[props.isDisabled ? 'grid grid-cols-8' : 'grid-cols-9']"
    >
      <div class="col-span-5 flex gap-3">
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
          @add-new="onAddNew"
          v-model="model.product_id"
          :can-search="true"
          :disabled="props.isDisabled"
          :error="modelErrors.product_id"
          :error-has-text="false"
          @change="onChange"
        />
      </div>
      <CustomInput
        type="number"
        name="quantity"
        class="col-span-1"
        placeholder="quantity"
        v-model="model.quantity"
        :error-has-text="false"
        :disabled="props.isDisabled"
        :error="modelErrors.quantity"
      />
      <CustomInput
        name="cost"
        type="number"
        class="col-span-1"
        placeholder="Cost"
        v-model="model.cost"
        :error-has-text="false"
        :error="modelErrors.cost"
        :disabled="props.isDisabled"
      />
      <CustomInput
        type="number"
        name="amount"
        class="col-span-1"
        placeholder="Amount"
        v-model="model.amount"
        :error-has-text="false"
        :error="modelErrors.amount"
        :disabled="props.isDisabled"
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
import { onMounted, ref, watch } from 'vue'
import CustomInput from '../shared/CustomInput.vue'
import { useProductStore } from '@/stores/product'
import Event from '@/event'
import { useRouter } from 'vue-router'
import { InventoryConst, TransferConst } from '@/const/route.constants'

const emit = defineEmits(['remove'])

const props = defineProps({
  ndx: {
    type: Number
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

const model = defineModel()
const modelErrors = ref({})

const router = useRouter()
const productStore = useProductStore()

/** ================================================
 * EVENTS
 ** ================================================*/
Event.on(
  props.eventName,
  (data) => {
    if (typeof props.ndx != 'undefined') {
      modelErrors.value = data[props.ndx] ? data[props.ndx] : {}
    }
  },
  true
)

/** ================================================
 * METHODS
 ** ================================================*/
const onChange = () => {
  if (model.value.product_id) {
    const product = productStore.products.find(
      (prd) => prd.id == model.value.product_id
    )

    if (product) {
      model.value.cost = product.price
      model.value.quantity = 1
    }
  } else {
    model.value.product_id = ''
    model.value.description = ''
    model.value.quantity = ''
    model.value.cost = ''
  }
}

const onAddNew = () => {
  router.push({
    name: InventoryConst.PRODUCT_FORM,
    query: {
      redirect: TransferConst.STR_FORM
    }
  })
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await productStore.getProducts()
})

/** ================================================
 * WATCHERS
 ** ================================================*/
watch(
  () => model.value.quantity,
  () => {
    model.value.amount = model.value.cost * model.value.quantity
  }
)
</script>
