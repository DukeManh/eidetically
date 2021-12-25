import Resizer from 'react-image-file-resizer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noop = (...args: unknown[]) => {};

export function on<
  T extends Window | Document | HTMLElement | EventTarget,
  K extends keyof HTMLElementEventMap
>(obj: T | null, event: K, handler: EventListenerOrEventListenerObject) {
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
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((item, index) => deepEqual(item, b[index]))
    );
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => deepEqual(a[key], b[key]));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(cb: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      cb.apply(this, args);
    };
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  } as T;
}

export function copyToClipboard(text: string) {
  if (isBrowser) {
    navigator.clipboard.writeText(text);
  }
}

export function createImagePreview(image: File): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      Resizer.imageFileResizer(
        image,
        500,
        1000,
        'JPEG',
        100,
        0,
        (blob) => {
          const resizedImage = new File([blob as Blob], image.name, {
            type: image.type,
          });

          resolve(resizedImage);
        },
        'blob'
      );
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}
