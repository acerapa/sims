import { onMounted } from 'vue'

export function useTableScroll(tableRef) {
  onMounted(() => {
    /**
     * TODO: Check for scrollbar and get the scrollbar width
     * Apply the scroll bar with with the with of the sidenav, paddings and margins
     */

    const constantUntrackWidth = 360
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth || 0

    const mainTable = Array.from(tableRef.value.children).find((child) =>
      Array.from(child.classList).includes('main-table')
    )

    // setting inline styles to the table wrapper
    if (mainTable) {
      mainTable.style = `
					width: calc(100vw - ${scrollbarWidth + constantUntrackWidth}px);
					overflow-x: auto;
				`
    }
  })
}
