import { authenticatedApi } from "@/api";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useVendorStore = defineStore("supplier", () => {
  const suppliers = ref([]);

  const selectedSupplier = ref();

  const supplierOptions = computed(() => {
    return suppliers.value.map((sup) => {
      return {
        value: sup.id,
        text: sup.company_name,
      };
    });
  });

  const fetchAllSuppliers = async () => {
    const res = await authenticatedApi("suppliers/all");
    if (res.status == 200) {
      suppliers.value = res.data.suppliers;
    }
  };

  return {
    suppliers,
    supplierOptions,
    selectedSupplier,
    fetchAllSuppliers,
  };
});
