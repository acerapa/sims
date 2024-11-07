<template>
  <div class="cont flex flex-col gap-6">
    <div class="flex gap-6">
      <div class="flex-1">
        <p class="font-bold">Transfer Information</p>
        <div
          class="flex gap-3 items-center max-lg:flex-col max-lg:gap-3 max-lg:items-start max-lg:[&>div]:w-full"
        >
          <CustomInput
            type="select"
            class="flex-1"
            name="supplier"
            :has-label="true"
            label="Select supplier"
            :options="supplierOptions"
            placeholder="Select supplier"
            v-model="model.transfer.supplier_id"
            @change="populateAddress"
          />
          <CustomInput
            name="when"
            label="When"
            class="flex-1"
            :has-label="true"
            type="datetime-local"
            v-model="model.transfer.when"
          />
        </div>
        <CustomInput
          class="flex-1 mt-3"
          type="textarea"
          name="memo"
          label="Memo"
          :has-label="true"
          placeholder="Memo"
          v-model="model.transfer.memo"
        />
      </div>
      <div class="flex-1">
        <p class="font-bold">Supplier address information</p>
        <AddressForm v-model="address" :disabled="true" :has-label="true" />
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <p class="font-bold">Select Products</p>
      <ProductMultiSelectTable
        v-model="model.products"
        :header-component="RmaProductSelectHeader"
        :row-component="RmaProductSelectRow"
        :format="productDefaultValue"
      >
      </ProductMultiSelectTable>

      <div class="flex gap-3 mt-4 justify-end">
        <button
          class="btn-outline !border-danger !text-danger"
          @click="onCancel"
        >
          Cancel
        </button>
        <button class="btn-outline disabled:opacity-50" :disabled="false">
          Save and New
        </button>
        <button
          class="btn disabled:opacity-50"
          @click="onSubmit"
          :disabled="false"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomInput from "@/components/shared/CustomInput.vue";
import AddressForm from "@/components/shared/AddressForm.vue";
import RmaProductSelectRow from "@/components/stock-transfer/RmaProductSelectRow.vue";
import RmaProductSelectHeader from "@/components/stock-transfer/RmaProductSelectHeader.vue";
import ProductMultiSelectTable from "@/components/shared/ProductMultiSelectTable.vue";
import { useVendorStore } from "@/stores/supplier";
import { computed, onMounted, ref } from "vue";
import { ObjectHelpers } from "shared/helpers";
import { TransferType } from "shared/enums";
import { useRouter } from "vue-router";
import { useTransferStore } from "@/stores/transfer";
import { useAppStore } from "@/stores/app";
import { useSettingsStore } from "@/stores/settings";
import { useAuthStore } from "@/stores/auth";

const currentBranch = ref(null);

const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore(); // this is temporary
const transferStore = useTransferStore();
const settingsStore = useSettingsStore(); // this is temporaru

const address = ref({
  address1: "",
  address2: "",
  city: "",
  province: "",
  state: "",
  postal: "",
});

const productDefaultValue = {
  product_id: "",
  description: "",
  quantity: "",
  cost: "",
  amount: "",
};

const vendorStore = useVendorStore();

const defualtValue = {
  transfer: {
    supplier_id: "",
    when: "",
    memo: "",
    branch_from: "",
    processed_by: "",
    type: TransferType.RMA,
  },
  products: [{ ...productDefaultValue }],
};

const model = ref({ ...defualtValue });

/** ================================================
 * COMPUTED
 ** ================================================*/
const supplierOptions = computed(() => {
  return vendorStore.suppliers.map((supplier) => {
    return {
      text: supplier.company_name,
      value: supplier.id,
    };
  });
});

/** ================================================
 * METHODS
 ** ================================================*/
const populateAddress = () => {
  const supplier = vendorStore.suppliers.find((supplier) => {
    return supplier.id === model.value.transfer.supplier_id;
  });

  address.value = ObjectHelpers.assignSameFields(
    address.value,
    supplier.address
  );
};

const onSubmit = () => {
  model.value.transfer.when = new Date();
  const res = transferStore.createTransfer(model.value);

  if (res.status == 200) {
    router.push({
      name: "rma-list",
    });
  }
};

const onCancel = () => {
  router.back();
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await vendorStore.fetchAllSuppliers();
  await settingsStore.fetchAllBranches();
  currentBranch.value = appStore.currentBranch;

  model.value.transfer.branch_from = currentBranch.value.id;
  model.value.transfer.processed_by = authStore.getAuthUser().id;
});
</script>
