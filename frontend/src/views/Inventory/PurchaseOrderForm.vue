<template>
  <div class="flex flex-col gap-4">
    <div class="bg-white rounded-2xl p-4 shadow flex flex-col gap-3">
      <p class="text-base font-semibold">New Purchase Order</p>
      <div class="flex flex-col gap-3">
        <div class="flex gap-3">
          <div class="flex-1 flex flex-col gap-2">
            <p class="text-sm font-semibold">Order Info</p>
            <input type="text" class="input" placeholder="Ref. No." />
            <div class="flex-1 flex flex-col">
              <select
                name=""
                id=""
                class="input"
                v-model="model.supplier_id"
                :disabled="!supplierStore.suppliers.length"
              >
                <option value="" hidden>*Select Supplier</option>
                <option value="ADD NEW">&lt;&lt;Add New&gt;&gt;</option>
                <option
                  v-for="(sup, ndx) in supplierStore.suppliers"
                  :value="sup.id"
                  :key="ndx"
                >
                  {{ sup.company_name }}
                </option>
              </select>
              <RouterLink
                v-if="!supplierStore.suppliers.length"
                :to="{ name: 'vendors' }"
                class="text-center"
              >
                <small class="text-red-500"
                  >***Please add suppliers first, just
                  <small class="text-blue-500">click here</small>***</small
                >
              </RouterLink>
            </div>
            <div class="flex gap-3">
              <input
              type="text"
              class="flex-1 input"
              placeholder="Date"
              @focus="$event.target.type = 'date'"
              @blur="$event.target.type = 'text'"
            />
            <input
              type="text"
              class="flex-1 input"
              placeholder="Bill Due"
              @focus="$event.target.type = 'date'"
              @blur="$event.target.type = 'text'"
            />
            </div>
          </div>
          <div class="flex-1 flex flex-col gap-2">
            <p class="text-sm font-semibold">Address Info</p>
            <AddressForm />
          </div>
        </div>
        <textarea name="" id="" class="input resize-none" placeholder="Memo"></textarea>
      </div>

      <p class="text-base font-semibold">Select Products</p>

      <div class="flex flex-col gap-4">
        
      </div>
    </div>
  </div>
  <code>Purchase Order Form</code>
</template>
<script setup>
import { useVendorStore } from "@/stores/supplier";
import { onMounted, ref } from "vue";
import AddressForm from "@/components/shared/AddressForm.vue";

const supplierStore = useVendorStore();

const model = ref({
  supplier_id: "",
});

onMounted(async () => {
  await supplierStore.fetchAllSuppliers();
});
</script>
