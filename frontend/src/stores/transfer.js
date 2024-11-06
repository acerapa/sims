import { authenticatedApi, Method } from "@/api";
import { defineStore } from "pinia";
import { TransferType } from "shared/enums";
import { ref } from "vue";

export const useTransferStore = defineStore("tranfer", function () {
  const strs = ref([]);
  const ibrrs = ref([]);
  const transfer = ref(null);

  const fetchByType = async (type) => {
    const res = await authenticatedApi(`transfer/all/${type}`);

    if (res.status == 200) {
      if (type == TransferType.IBRR) {
        ibrrs.value = res.data.transfer;
      } else if (type == TransferType.STR) {
        strs.value = res.data.transfer;
      }
    }
  };

  const createTransfer = async (model) => {
    return await authenticatedApi(`transfer/register`, Method.POST, model);
  };

  const fetchById = async (id) => {
    const res = await authenticatedApi(`transfer/${id}`);

    if (res.status == 200) {
      transfer.value = res.data.transfer;
    }

    return transfer.value;
  };

  const getByIdAndOrType = async (id, type = null) => {
    let transfers = [];
    if (type) {
      transfers = type == TransferType.IBRR ? ibrrs.value : strs.value;
    } else {
      transfers = [...strs.value, ...ibrrs.value];
    }

    const t = transfers.find((t) => t.id == id);

    return t ? t : await fetchById(id);
  };

  return {
    strs,
    ibrrs,
    fetchByType,
    createTransfer,
    getByIdAndOrType,
  };
});
