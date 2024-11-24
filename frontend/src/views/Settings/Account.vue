<template>
  <div>
    <AccountModal
      v-model="showModal"
      :selected-id="selectedId"
      v-if="showModal"
    />
    <CustomTable
      :has-filter="true"
      :has-add-btn="true"
      :data="filteredData"
      :has-pagination="true"
      v-model:is-edit="isEdit"
      :row-prop-init="accountRowEvent"
      v-model:search-text="searchText"
      :table-row-component="AccountRow"
      @add-new-record="onNewRecord"
      @view="onView"
    >
      <template #table_header>
        <div class="grid grid-cols-8 gap-3">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-3 table-header">Account Name</p>
          <p class="col-span-2 table-header">Type</p>
          <p class="col-span-2 table-header">Date Added</p>
        </div>
      </template>
      <template v-slot:filters>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col">
            <small>Account Type</small>
            <CustomInput
              type="select"
              name="account_type"
              placeholder="Account Type"
              v-model="filter.type"
              :options="[
                {
                  value: 'income',
                  text: 'Income'
                },
                {
                  value: 'expense',
                  text: 'Expense'
                }
              ]"
            />
          </div>
          <div class="flex flex-col">
            <small><b>Date Added</b></small>
            <div class="flex gap-3">
              <div class="flex flex-col">
                <small>From</small>
                <CustomInput
                  type="date"
                  name="from"
                  v-model="dateAdded.from"
                  @reset="dateAdded.from = ''"
                />
              </div>
              <div class="flex flex-col">
                <small>To</small>
                <CustomInput
                  type="date"
                  name="to"
                  v-model="dateAdded.to"
                  @reset="dateAdded.to = ''"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import AccountModal from '@/components/Settings/AccountModal.vue'
import AccountRow from '@/components/Settings/AccountRow.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { useSettingsStore } from '@/stores/settings'
import { DateHelpers } from 'shared/helpers'
import { computed, onMounted, ref } from 'vue'

const selectedId = ref(0)
const isEdit = ref(false)
const showModal = ref(false)

const settingsStore = useSettingsStore()

const filter = ref({
  type: ''
})

const searchText = ref()
const dateAdded = ref({
  from: '',
  to: ''
})

/** ================================================
 * EVENTS
 ** ================================================*/

// Is page loading
Event.emit(EventEnum.IS_PAGE_LOADING, true)

// define account row props
const accountRowEvent = 'account-row-init-props'
Event.on(accountRowEvent, function (data) {
  // initize the value of props here
  return { account: data }
})

/** ================================================
 * COMPUTED
 ** ================================================*/

const filteredData = computed(() => {
  return settingsStore.accounts
    .filter((account) =>
      filter.value.type ? account.type == filter.value.type : account
    )
    .filter((account) =>
      DateHelpers.getRangeDates(
        dateAdded.value.from,
        dateAdded.value.to,
        account.createdAt
      )
    )
    .filter((account) => {
      const searchCondition =
        `${account.id} ${account.type} ${account.name}`.toLowerCase()
      return searchText.value
        ? searchCondition.includes(searchText.value.toLowerCase())
        : account
    })
})

/** ================================================
 * METHODS
 ** ================================================*/
const onView = (id) => {
  selectedId.value = id
  showModal.value = true
}

const onNewRecord = () => {
  selectedId.value = 0
  showModal.value = true
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await settingsStore.fetchAllAccounts()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
