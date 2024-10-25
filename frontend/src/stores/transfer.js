import { authenticatedApi, Method } from "@/api";
import { defineStore } from "pinia";
import { TransferType } from "shared/enums/transfer";
import { ref } from "vue";

export const useTransferStore = defineStore("tranfer", function () {
  const strs = ref([]);
  const ibrrs = ref([]);

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

  return {
    strs,
    ibrrs,
    fetchByType,
    createTransfer,
  };
});
