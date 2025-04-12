import { EventEnum } from '@/data/event'
import Event from '@/event'
import { useAppStore } from '@/stores/app'
import { onMounted } from 'vue'

export function useRetainPageStateOnReload(state, currentRoute) {
  const { getPageState, setPageState, isPageExist } = useAppStore()

  onMounted(() => {
    if (state && !isPageExist(state)) {
      const strPageState = localStorage.getItem('page-state')
      if (!strPageState) return
      const pageState = JSON.parse(strPageState)
      setPageState(state, pageState)
    } else {
      localStorage.setItem('page-state', JSON.stringify(getPageState(state)))
    }
  })

  // Use event to remove the state
  Event.on(
    EventEnum.ROUTE_CHANGE,
    (r) => {
      if (currentRoute != r.to.name) {
        localStorage.removeItem('page-state')
      }
    },
    true
  )
}
