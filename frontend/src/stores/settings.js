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

  const categoryOption = async () => {
    const cats = productCategories.value.length
      ? productCategories.value
      : await fetchAllProductCategories();

    return cats.map((category) => {
      return {
        text: category.name,
        value: category.id,
      };
    });
  };

  const getProductCategoryByIdSync = (id) => {
    return productCategories.value.find((cat) => cat.id == id);
  };

  const getProductCategoryByIdAsync = async (id) => {
    let category = getProductCategoryByIdSync(id);

    if (!category) {
      await fetchAllProductCategories();
      category = getProductCategoryByIdSync(id);
    }

    return category;
  };

  return {
    accounts,
    productCategories,
    productReorderingPoints,
    categoryOption,
    fetchAllAccounts,
    fetchAllProductCategories,
    getProductCategoryByIdSync,
    getProductCategoryByIdAsync,
    fetchAllProductReorderingPoints,
  };
});
