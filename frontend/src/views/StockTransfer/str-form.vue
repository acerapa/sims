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
            :options="branchOptions"
            :has-label="true"
            label="Select Branch"
            placeholder="Select Branch"
            v-model="model.branch_to"
            @change="populateAddress"
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
        <AddressForm
          v-model="model.address"
          :has-label="true"
          :disabled="true"
        />
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
            <span class="text-sm">&#8369; {{ totalAmount }}</span>
          </div>
        </template>
      </ProductMulitpleSelect>
    </div>
    <div class="flex gap-3">
      <button class="btn-outline">Cancel</button>
      <button class="btn-outline">Save and New</button>
      <button class="btn" @click="onSubmit">Save</button>
    </div>
  </div>
</template>

<script setup>
import CustomInput from "@/components/shared/CustomInput.vue";
import AddressForm from "@/components/shared/AddressForm.vue";
import ProductSelectHeader from "@/components/stock-transfer/ProductSelectHeader.vue";
import ProductSelectRow from "@/components/stock-transfer/ProductSelectRow.vue";
import ProductMulitpleSelect from "@/components/shared/ProductMultiSelectTable.vue";
import { computed, onMounted, ref } from "vue";
import { useProductStore } from "@/stores/product";
import { useSettingsStore } from "@/stores/settings";
import Event from "@/event";
import { EventEnum } from "@/data/event";
import { ObjectHelpers } from "shared/helpers";
import { TransferType } from "shared/enums/transfer";
import { useTransferStore } from "@/stores/transfer";

const productDefaultValue = {
  product_id: "",
  name: "",
  description: "",
  quantity: "",
  cost: "",
  amount: "",
};

const defaultValue = {
  memo: "",
  branch_to: "",
  date_time: new Date().toISOString().split(":").slice(0, 2).join(":"),
  address: {
    address1: "",
    address2: "",
    province: "",
    city: "",
    postal: "",
  },
  type: TransferType.STR,
  products: [{ ...productDefaultValue }],
};

const model = ref(defaultValue);

const productStore = useProductStore();
const settingStore = useSettingsStore();
const transferStore = useTransferStore();
/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

/** ================================================
 * COMPUTED
 ** ================================================*/
const totalAmount = computed(() => {
  return model.value.products.length
    ? model.value.products.map((p) => p.amount).reduce((a, b) => a + b)
    : 0;
});

const branchOptions = computed(() => {
  return settingStore.branches.map((branch) => {
    return {
      text: branch.name,
      value: branch.id,
    };
  });
});

/** ================================================
 * METHODS
 ** ================================================*/

// TODO: Regulate the interval when to have or not.
const timeInterval = setInterval(() => {
  model.value.date_time = new Date()
    .toISOString()
    .split(":")
    .slice(0, 2)
    .join(":");
}, 60000);

const populateAddress = () => {
  if (model.value.branch_to) {
    const branch = settingStore.branches.find(
      (b) => b.id == model.value.branch_to
    );

    if (branch) {
      model.value.address = ObjectHelpers.assignSameFields(
        model.value.address,
        branch.address
      );
    }
  }
};

const onSubmit = async () => {
  clearInterval(timeInterval);

  await transferStore.createTransfer(model.value);
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await productStore.fetchAllProducts();
  await settingStore.fetchAllBranches();

  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
