export const usePrint = () => {
  const startPrint = () => {
    window.print()
  }

  return {
    startPrint
  }
}
