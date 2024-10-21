<template>
  <div class="cont">
    <div class="flex gap-4 max-lg:flex-col">
      <div class="flex flex-col gap-3 flex-1">
        <p class="text-base font-semibold">Transfer Information</p>
        <div class="flex gap-3">
          <CustomInput
            type="select"
            name="branch"
            class="flex-1"
            :options="[]"
            :has-label="true"
            label="Select Branch"
            placeholder="Select Branch"
            v-model="model.to"
          />
          <CustomInput
            type="datetime-local"
            name="date"
            class="flex-1"
            :has-label="true"
            label="Date and Time"
            :disabled="true"
            v-model="model.date_time"
          />
        </div>

        <CustomInput
          type="textarea"
          :has-label="true"
          label="Memo"
          name="memo"
          placeholder="Write Something"
        />
      </div>

      <div class="flex flex-col gap-3 flex-1">
        <p class="text-base font-semibold">Address Info</p>
        <AddressForm v-model="model.address" :has-label="true" />
      </div>
    </div>
    <div class="flex flex-col gap-3 mt-5">
      <p class="text-base font-semibold">Select Product</p>
      <ProductMulitpleSelect
        v-model="model.products"
        :header-component="ProductSelectHeader"
        :row-component="ProductSelectRow"
        :format="productDefaultValue"
      >
        <template v-slot:aggregate>
          <div>
            <span class="font-bold text-sm">Total: </span>
            <span class="text-sm">&#8369; 40000.00</span>
          </div>
        </template>
      </ProductMulitpleSelect>
    </div>
    <button class="btn mt-5 float-right" @click="console.log(model)">
      Save
    </button>
  </div>
</template>

<script setup>
import CustomInput from "@/components/shared/CustomInput.vue";
import AddressForm from "@/components/shared/AddressForm.vue";
import ProductSelectHeader from "@/components/stock-transfer/ProductSelectHeader.vue";
import ProductSelectRow from "@/components/stock-transfer/ProductSelectRow.vue";
import ProductMulitpleSelect from "@/components/shared/ProductMultiSelectTable.vue";
import { onMounted, ref } from "vue";
import { useProductStore } from "@/stores/product";

const productDefaultValue = {
  product_id: "",
  name: "",
  description: "",
  quantity: "",
  cost: "",
  amount: "",
};

const defaultValue = {
  to: "",
  memo: "",
  date_time: new Date().toISOString().split(":").slice(0, 2).join(":"),
  address: {
    address1: "",
    address2: "",
    city: "",
    postal: "",
  },
  products: [{ ...productDefaultValue }],
};

const timeInterval = setInterval(() => {
  model.value.date_time = new Date()
    .toISOString()
    .split(":")
    .slice(0, 2)
    .join(":");
}, 60000);

// TODO: Regulate the interval when to have or not.

const model = ref(defaultValue);

const productStore = useProductStore();

onMounted(async () => {
  await productStore.fetchAllProducts();
});
</script>
