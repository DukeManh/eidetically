// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noop = (...args: unknown[]) => {};

export function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  event: string,
  handler: (e: Event) => void
): void {
  (obj?.addEventListener || noop)(event, handler);
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  event: string,
  handler: (e: Event) => void
): void {
  (obj?.removeEventListener || noop)(event, handler);
}

export const isBrowser = typeof window !== 'undefined';

type Falsy = boolean | undefined | null | 0;

export function classNames(...classes: (string | Falsy)[]) {
  return classes.filter(Boolean).join(' ');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(cb: T, wait: number) {
  let timeout: NodeJS.Timeout | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => cb.apply(this, args), wait);
  } as T;
}
