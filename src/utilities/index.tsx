export const noop = () => {};

export function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  event: string,
  handler: (e: Event) => void
): void {
  if (obj?.addEventListener) {
    obj.addEventListener(event, handler);
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  event: string,
  handler: (e: Event) => void
): void {
  if (obj?.removeEventListener) {
    obj.removeEventListener(event, handler);
  }
}

export const isBrowser = typeof window !== 'undefined';
