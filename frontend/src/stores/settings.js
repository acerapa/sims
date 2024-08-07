import { authenticatedApi } from "@/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const productCategories = ref([]);
  const accounts = ref([]);
  const productReorderingPoints = ref([]);

  const fetchAllProductCategories = async () => {
    const res = await authenticatedApi("product-category/all");
    if (res.status == 200) {
      productCategories.value = res.data.categories;
    }

    return res.data.categories;
  };

  const fetchAllAccounts = async () => {
    const res = await authenticatedApi("settings/accounts/all");
    if (res.status == 200) {
      accounts.value = res.data.accounts;
    }
    return res.data.accounts;
  };

  const fetchAllProductReorderingPoints = async () => {
    const res = await authenticatedApi("product-setting/all");
    if (res.status == 200) {
      productReorderingPoints.value = res.data.productReorderingPoints;
    }

    return res.data.productReorderingPoints;
  };

  return {
    accounts,
    productCategories,
    productReorderingPoints,
    fetchAllAccounts,
    fetchAllProductCategories,
    fetchAllProductReorderingPoints,
  };
});
