import { authenticatedApi } from "@/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePurchaseOrderStore = defineStore("purchase-order", () => {
  const purchaseOrders = ref([]);
  const purchaseOrder = ref(null);

  const fetchPurchaseOrders = async () => {
    const res = await authenticatedApi("/purchase-order/all");
    if (res.status == 200) {
      purchaseOrders.value = res.data.orders;
      return res.data.orders;
    }
    return [];
  };

  const fetchPurchaseOrderById = async (id) => {
    const res = await authenticatedApi("/purchase-order/" + id);
    if (res.status == 200) {
      purchaseOrder.value = res.data.order;

      return res.data.order;
    }
  };

  return {
    purchaseOrder,
    purchaseOrders,
    fetchPurchaseOrders,
    fetchPurchaseOrderById,
  };
});
