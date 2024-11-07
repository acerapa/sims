import { authenticatedApi, Method } from "@/api";
import { defineStore } from "pinia";
import { TransferType } from "shared/enums";
import { computed, ref } from "vue";

export const useTransferStore = defineStore("tranfer", function () {
  const transfers = ref([]);
  const transfer = ref(null);

  const ibrrs = computed(() => {
    return transfers.value.filter((t) => t.type === TransferType.IBRR);
  });

  const strs = computed(() => {
    return transfers.value.filter((t) => t.type === TransferType.STR);
  });

  const rmas = computed(() => {
    return transfers.value.filter((t) => t.type === TransferType.RMA);
  });

  const fetchTransfers = async (type) => {
    const res = await authenticatedApi(`stock-transfer`);

    if (res.status == 200) {
      transfers.value = res.data.transfers;
    }
  };

  const createTransfer = async (model) => {
    return await authenticatedApi(`stock-transfer/register`, Method.POST, model);
  };

  const fetchById = async (id) => {
    const res = await authenticatedApi(`stock-transfer/${id}`);

    if (res.status == 200) {
      transfer.value = res.data.transfer;
    }

    return transfer.value;
  };

  const getById = async (id) => {
    const t = transfers.value.find((t) => t.id == id);
    return t ? t : await fetchById(id);
  };

  return {
    rmas,
    strs,
    ibrrs,
    getById,
    fetchTransfers,
    createTransfer,
  };
});
