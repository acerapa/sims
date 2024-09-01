import { authenticatedApi } from "@/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePhysicalInventoryStore = defineStore(
  "physical-inventory",
  () => {
    const physicalInventories = ref([]);

    const fetchAllPhysicalInventories = async () => {
      const res = await authenticatedApi(`physical-inventory/all`);

      if (res.status == 200) {
        physicalInventories.value = res.data.physical_inventories;
      }

      return physicalInventories.value;
    };

    return {
      physicalInventories,
      fetchAllPhysicalInventories,
    };
  }
);
