const Breakpoints = {
  smallScreen: '768px',
};

export function navigationBarCollapsed() {
  return typeof window === 'undefined'
    ? false
    : window.matchMedia(`(max-width: ${Breakpoints.smallScreen})`).matches;
}
