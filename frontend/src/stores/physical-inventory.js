import { authenticatedApi, Method } from "@/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePhysicalInventoryStore = defineStore(
  "physical-inventory",
  () => {
    const physicalInventories = ref([]);
    const physicalInventory = ref(null);

    const fetchAllPhysicalInventories = async () => {
      const res = await authenticatedApi(`physical-inventory/all`);

      if (res.status == 200) {
        physicalInventories.value = res.data.physical_inventories;
      }

      return physicalInventories.value;
    };

    const fetchOne = async (id) => {
      const res = await authenticatedApi(`physical-inventory/${id}`);
      if (res.status == 200) {
        physicalInventory.value = res.data.physical_inventory;
      }

      return physicalInventory.value;
    };

    const register = async (model) => {
      return await authenticatedApi(
        `physical-inventory/register`,
        Method.POST,
        model
      );
    };

    const update = async (id, model) => {
      const res = await authenticatedApi(
        `physical-inventory/update/${id}`,
        Method.POST,
        model
      );

      return res;
    };

    const updateItem = async (id, model) => {
      const res = await authenticatedApi(
        `physical-inventory/item/${id}`,
        Method.POST,
        model
      );

      return res;
    };

    const getGroupedItems = async (id) => {
      if (!physicalInventory.value || physicalInventory.value.id == id) {
        await fetchOne(id);
      }

      const physicalInventoryCopy = { ...physicalInventory.value };

      physicalInventoryCopy.grouped_items = Object.groupBy(
        physicalInventory.value.items,
        ({ product }) => product.category_id
      );

      return physicalInventoryCopy;
    };

    return {
      physicalInventory,
      physicalInventories,
      update,
      fetchOne,
      register,
      updateItem,
      getGroupedItems,
      fetchAllPhysicalInventories,
    };
  }
);
