<template>
  <div class="flex gap-3">
    <div class="relative" @click.stop="">
      <div
        v-if="showDropdown"
        class="cont absolute z-20 top-0 right-0 !py-2 !px-3"
      >
        <div class="flex gap-8 items-end">
          <p class="text-sm text-nowrap">Select status</p>
          <button @click="showDropdown = false">&times;</button>
        </div>
        <div class="flex flex-col gap-1 mt-3">
          <div v-for="key in Object.keys(props.statusMap)" :key="key">
            <div class="flex gap-2" v-if="isShowItem(props.statusMap[key])">
              <input
                v-model="status"
                type="radio"
                :id="key"
                name="status"
                :value="key"
              />
              <label
                :for="key"
                class="text-sm !bg-transparent"
                :class="props.statusMap[key].class"
              >
                {{ props.statusMap[key].text }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BadgeComponent
      :text="props.statusMap[status].text"
      :custom-class="props.statusMap[status].class"
      @click.stop="showDropdown = true"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BadgeComponent from '../shared/BadgeComponent.vue'
import Event from '@/event'
import { EventEnum } from '@/data/event'

const props = defineProps({
  statusMap: {
    type: Object,
    default: () => ({})
  }
})

const showDropdown = ref(false)

const status = defineModel()

Event.on(EventEnum.GLOBAL_CLICK, () => {
  showDropdown.value = false
})

const isShowItem = (status) => {
  return typeof status.isShow === 'undefined' ? true : status.isShow
}
</script>
