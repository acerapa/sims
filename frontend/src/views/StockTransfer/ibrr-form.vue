<template>
  <div class="flex flex-col gap-4">
    <AlertComponent
      v-if="!currentBranch"
      type="danger"
      :text="'Please select current branch'"
    >
      Please refer
      <RouterLink class="text-blue-400 underline" :to="{ name: 'branches' }">
        here!
      </RouterLink>
    </AlertComponent>

    <div class="cont flex flex-col gap-8">
      <div class="flex gap-3">
        <div class="flex-1">
          <p class="font-semibold">Receive Information</p>
          <div class="flex gap-3 items-center mt-3">
            <CustomInput
              type="datetime-local"
              name="when"
              :has-label="true"
              label="Receiving date and time"
              :disabled="true"
              v-model="model.transfer.when"
            />
          </div>
          <div class="flex gap-3 items-center">
            <CustomInput
              type="text"
              name="str#"
              class="flex-1"
              :has-label="true"
              label="Str #"
              placeholder="Ex. 01"
              v-model="model.transfer.str_id"
            />
            <CustomInput
              type="select"
              name="branch_to"
              class="flex-1"
              :has-label="true"
              label="From Branch"
              :options="branchOptions"
              placeholder="Select Branch"
              v-model="model.transfer.branch_from"
              @change="populateAddress"
            />
          </div>
          <CustomInput
            type="textarea"
            name="memo"
            class="mt-3"
            :has-label="true"
            label="Memo"
            v-model="model.transfer.memo"
            placeholder="Write Something"
          />
        </div>
        <div class="flex-1">
          <p class="font-semibold">Branch Address Information</p>
          <AddressForm :has-label="true" v-model="address" :disabled="true" />
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <p class="font-semibold">Select Product</p>
        <ProductMultiSelectTable
          v-model="model.products"
          :header-component="IbrrSelectHeader"
          :row-component="ProductSelectRow"
          :format="productDefaultValue"
        />
      </div>
      <div class="flex gap-3 mt-4 justify-end">
        <button
          class="btn-outline !border-danger !text-danger"
          @click="onCancel"
        >
          Cancel
        </button>
        <button
          class="btn-outline disabled:opacity-50"
          :disabled="!currentBranch"
        >
          Save and New
        </button>
        <button
          class="btn disabled:opacity-50"
          @click="onSubmit"
          :disabled="!currentBranch"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import AddressForm from "@/components/shared/AddressForm.vue";
import AlertComponent from "@/components/shared/AlertComponent.vue";
import CustomInput from "@/components/shared/CustomInput.vue";
import ProductMultiSelectTable from "@/components/shared/ProductMultiSelectTable.vue";
import IbrrSelectHeader from "@/components/stock-transfer/ibrr-select-header.vue";
import ProductSelectRow from "@/components/stock-transfer/ProductSelectRow.vue";
import { EventEnum } from "@/data/event";
import Event from "@/event";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";
import { useProductStore } from "@/stores/product";
import { useSettingsStore } from "@/stores/settings";
import { useTransferStore } from "@/stores/transfer";
import { TransferType } from "shared/enums";
import { DateHelpers, ObjectHelpers } from "shared/helpers";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const currentBranch = ref();
const appStore = useAppStore();
const authStore = useAuthStore();
const productStore = useProductStore();
const settingStore = useSettingsStore();
const transferStore = useTransferStore();

const productDefaultValue = {
  product_id: "",
  description: "",
  cost: "",
  quantity: "",
  amount: "",
};

const model = ref({
  transfer: {
    memo: "",
    str_id: "",
    branch_to: "",
    branch_from: "",
    processed_by: "",
    type: TransferType.IBRR,
    when: DateHelpers.formatDate(new Date(), "YYYY-MM-DDTHH:II-A"),
  },
  products: [{ ...productDefaultValue }],
});

const address = ref({
  address1: "",
  address2: "",
  province: "",
  city: "",
  postal: "",
});
/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

/** ================================================
 * COMPUTED
 ** ================================================*/
const branchOptions = computed(() => {
  return settingStore.branches
    .map((branch) => {
      return {
        text: branch.name,
        value: branch.id,
      };
    })
    .filter((opt) =>
      currentBranch.value ? currentBranch.value.id != opt.value : true
    );
});

/** ================================================
 * METHODS
 ** ================================================*/
const timeInterval = setInterval(() => {
  model.value.transfer.when = DateHelpers.formatDate(
    new Date(),
    "YYYY-MM-DDTHH:II-A"
  );
}, 1000);

const populateAddress = () => {
  if (model.value.transfer.branch_from) {
    const branch = settingStore.branches.find(
      (b) => b.id == model.value.transfer.branch_from
    );

    if (branch) {
      address.value = ObjectHelpers.assignSameFields(
        address.value,
        branch.address
      );
    }
  }
};

const onSubmit = async () => {
  clearInterval(timeInterval);

  await transferStore.createTransfer(model.value);

  router.push({ name: "ibrr-list" });
};

const onCancel = () => {
  router.push({ name: "ibrr-list" });
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await settingStore.fetchAllBranches();
  await productStore.fetchAllProducts();

  // check if route has transfer id
  if (route.query.id) {
    const transfer = await transferStore.getById(route.query.id);

    if (transfer) {
      model.value.transfer = ObjectHelpers.assignSameFields(
        model.value.transfer,
        transfer
      );

      // custom modification
      model.value.transfer.when = DateHelpers.formatDate(
        new Date(),
        "YYYY-MM-DDTHH:II:SS-A"
      );

      // populate address
      populateAddress();

      // populate products
      model.value.products = transfer.products.map((p) => {
        return {
          product_id: p.ProductTransaction.product_id,
          description: p.ProductTransaction.description,
          cost: p.ProductTransaction.cost,
          quantity: p.ProductTransaction.quantity,
          amount: p.ProductTransaction.amount,
        };
      });
    }
  }

  currentBranch.value = appStore.currentBranch;
  if (currentBranch.value) {
    model.value.transfer.branch_to = currentBranch.value.id;
  }

  model.value.transfer.processed_by = authStore.getAuthUser().id;

  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});

onBeforeUnmount(() => {
  // clear interval
  clearInterval(timeInterval);
});
</script>
