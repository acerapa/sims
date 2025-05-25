import { useAppStore } from '@/stores/app'
import { onMounted, ref, watch } from 'vue'

export function useTableScroll(tableRef, isFormTable = true) {
  const appStore = useAppStore()
  const keyCSSRulesIndexTracker = ref([])

  /** ================================================
   * LIFECYCLE HOOKS
   ** ================================================*/
  onMounted(() => {
    /**
     * TODO: Check for scrollbar and get the scrollbar width
     * Apply the scroll bar with with the with of the sidenav, paddings and margins
     */

    appStore.getCollpaseSideNav()

    handleResize()
  })

  /** ================================================
   * METHODS
   ** ================================================*/
  const handleResize = () => {
    const constantUntrackWidth = appStore.collpaseSideNav
      ? isFormTable
        ? 154
        : 106
      : isFormTable
        ? 360
        : 328
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth || 0

    const mainTable = Array.from(tableRef.value.children).find((child) =>
      Array.from(child.classList).includes('main-table')
    )

    // setting inline styles to the table wrapper
    if (mainTable) {
      generateKeyframeRules(
        mainTable.clientWidth,
        scrollbarWidth + constantUntrackWidth
      )
      // 		overflow-x: auto;
      // 	`

      mainTable.classList.add('resize-table')
      mainTable.classList.add('overflow-x-auto')

      // add event listener to remove the class after animation
      mainTable.addEventListener('animationend', () => {
        mainTable.classList.remove('resize-table')

        // remove the keyframe rules
        removeCSSRules()

        // set the table width to the main table width
        mainTable.style = `width: calc(100vw - ${scrollbarWidth + constantUntrackWidth}px);`
      })
    }
  }

  const generateKeyframeRules = (mainTableWidth, toBeDeduct) => {
    const styleSheet = document.styleSheets[0]

    if (styleSheet) {
      styleSheet.insertRule(
        `@keyframes resize-table {
            0% {
              width: ${mainTableWidth}px;
            }
            100% {
              width: ${window.innerWidth - toBeDeduct}px;
            }
          }`,
        styleSheet.cssRules.length
      )

      keyCSSRulesIndexTracker.value.push(styleSheet.cssRules.length - 1)

      // generate class that will use the keyframe
      const keyframeClass = `resize-table`
      styleSheet.insertRule(
        `.${keyframeClass} {
            animation: resize-table 0.5s ease-in-out;
          }`,
        styleSheet.cssRules.length
      )

      // track rules
      keyCSSRulesIndexTracker.value.push(styleSheet.cssRules.length - 1)
    }
  }

  const removeCSSRules = () => {
    const styleSheet = document.styleSheets[0]

    if (styleSheet) {
      for (let i = keyCSSRulesIndexTracker.value.length - 1; i >= 0; i--) {
        styleSheet.deleteRule(styleSheet.cssRules.length - 1)
      }
    }

    keyCSSRulesIndexTracker.value = []
  }

  /** ================================================
   * WATCHERS
   * ================================================*/
  watch(
    () => appStore.collpaseSideNav,
    () => {
      handleResize()
    }
  )
}
