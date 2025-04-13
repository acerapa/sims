<template>
  <slot></slot>
  <div
    class="grid gap-3 items-start min-w-[750px]"
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
        :options="productOptions"
        :has-add-new="true"
        @add-new="onNewProduct"
        v-model="product.product_id"
        :error="modelErrors.product_id"
        :key="product.product_id"
        :can-search="true"
        :disabled="props.isDisabled"
      />
    </div>
    <CustomInput
      type="number"
      name="quantity"
      class="col-span-1"
      placeholder="quantity"
      v-model="product.quantity"
      :disabled="props.isDisabled"
      :error="modelErrors.quantity"
    />
    <CustomInput
      name="cost"
      type="number"
      class="col-span-1"
      placeholder="Cost"
      v-model="product.cost"
      :disabled="props.isDisabled"
      :error="modelErrors.cost"
    />
    <CustomInput
      type="number"
      name="amount"
      class="col-span-1"
      placeholder="Amount"
      v-model="product.amount"
      :disabled="props.isDisabled"
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
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useProductStore } from '@/stores/product'
import CustomInput from '@/components/shared/CustomInput.vue'
import { getCost } from '@/helper'
import { useRouter } from 'vue-router'
import { InventoryConst, PurchaseConst } from '@/const/route.constants'
import Event from '@/event'

const props = defineProps({
  ndx: {
    type: Number,
    required: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  sup_id: {
    type: String
  },
  eventName: {
    type: String,
    required: false
  },
  selected: {
    type: Array,
    required: true
  }
})

const router = useRouter()
const modelErrors = ref({})
const product = defineModel()
const emit = defineEmits(['remove'])
const productStore = useProductStore()

/** ================================================
 * EVENTS
 ** ================================================*/
Event.on(props.eventName, (data) => {
  if (data && data[props.ndx] && !props.isDisabled) {
    modelErrors.value = data[props.ndx]
  } else {
    modelErrors.value = {}
  }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const productOptions = computed(() => {
  return productStore.supplierProducts
    .map((product) => {
      return {
        text: product.product_details.purchase_description,
        value: product.id
      }
    })
    .filter((prod) => {
      if (product.value.product_id == prod.value) return true
      return !props.selected.map((p) => p.product_id).includes(prod.value)
    })
})

/** ================================================
 * METHODS
 ** ================================================*/
const onNewProduct = () => {
  router.push({
    name: InventoryConst.PRODUCT_FORM,
    query: {
      redirect: PurchaseConst.PURCHASE_ORDER_FORM
    }
  })
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await productStore.getProducts()
})

/** ================================================
 * WATCHERS
 * ================================================*/
watch(
  () => product.value.product_id,
  (val) => {
    const prd = productStore.products.find((product) => product.id == val)
    if (prd) {
      product.value.product_id = prd.id
      product.value.quantity = product.value.quantity
        ? product.value.quantity
        : 1 // will always set quantity upon create
      product.value.cost = getCost(product.value.cost, prd, props.sup_id)
    }
  }
)

watch(
  () => [product.value.quantity, product.value.cost],
  (val) => {
    if (val) {
      product.value.amount = product.value.cost * product.value.quantity
    }
  }
)
</script>
