export function debounce<T extends (...args: Array<any>) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined

  return function debounced(...args: Parameters<T>) {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      func(...args)
    }, wait)
  }
}
