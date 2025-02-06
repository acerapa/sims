<template>
  <slot></slot>
  <div
    class="grid gap-3 items-start min-w-[750px]"
    :class="[props.isDisabled ? 'grid grid-cols-8' : 'grid-cols-9']"
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
        :options="productOptions"
        :has-add-new="true"
        @add-new="onNewProduct"
        v-model="product.product_id"
        :error="props.errors.product_id"
        :key="product.product_id"
        :can-search="true"
        :disabled="props.isDisabled"
      />
    </div>
    <CustomInput
      type="text"
      class="col-span-3"
      name="description"
      placeholder="Description"
      :disabled="props.isDisabled"
      v-model="product.description"
      :error="props.errors.description"
    />
    <CustomInput
      type="number"
      name="quantity"
      class="col-span-1"
      placeholder="quantity"
      v-model="product.quantity"
      :disabled="props.isDisabled"
      :error="props.errors.quantity"
    />
    <CustomInput
      name="cost"
      type="number"
      class="col-span-1"
      placeholder="Cost"
      v-model="product.cost"
      :disabled="props.isDisabled"
      :error="props.errors.cost"
    />
    <CustomInput
      type="number"
      name="amount"
      class="col-span-1"
      placeholder="Amount"
      v-model="product.amount"
      :disabled="props.isDisabled"
      :error="props.errors.amount"
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
import {
  InventoryConst,
  PurchaseConst
} from '@/router/constants/route.constants'

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
  errors: {
    type: Object,
    default: () => ({}),
    required: false
  },
  selected: {
    type: Array,
    required: true
  }
})

const router = useRouter()
const product = defineModel()
const emit = defineEmits(['remove'])
const productStore = useProductStore()
const productOptions = computed(() => {
  return productStore.supplierProducts
    .map((product) => {
      return {
        text: product.name,
        value: product.id
      }
    })
    .filter((prod) => {
      if (product.value.product_id == prod.value) return true
      return !props.selected.map((p) => p.product_id).includes(prod.value)
    })
})

const onNewProduct = () => {
  router.push({
    name: InventoryConst.PRODUCT_FORM,
    query: {
      redirect: PurchaseConst.PURCHASE_ORDER_FORM
    }
  })
}

onMounted(async () => {
  await productStore.getProducts()
})

watch(
  () => product.value.product_id,
  (val) => {
    const prd = productStore.products.find((product) => product.id == val)
    if (prd) {
      product.value.product_id = prd.id
      product.value.name = prd.name
      product.value.description = product.value.description
        ? product.value.description
        : prd.product_details.purchase_description
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
