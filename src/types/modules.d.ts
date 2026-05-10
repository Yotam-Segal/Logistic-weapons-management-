// * Type shims for untyped third-party modules used by the RTL pipeline
declare module 'stylis' {
  import type { StylisPlugin } from '@emotion/cache';
  export const prefixer: StylisPlugin;
}

declare module 'stylis-plugin-rtl' {
  import type { StylisPlugin } from '@emotion/cache';
  const rtlPlugin: StylisPlugin;
  export default rtlPlugin;
}
