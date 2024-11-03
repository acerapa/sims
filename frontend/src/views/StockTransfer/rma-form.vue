<template>
  <div class="cont flex flex-col gap-6">
    <div class="flex gap-6">
      <div class="flex-1">
        <p class="font-bold">Transfer Information</p>
        <div class="flex gap-3 items-center">
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
      >
      </ProductMultiSelectTable>
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

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await vendorStore.fetchAllSuppliers();
});
</script>
