import { assertQrl } from '../qrl/qrl-class';
import type { QRL } from '../qrl/qrl.public';
import { getContext, HOST_FLAG_NEED_ATTACH_LISTENER } from '../state/context';
import { type Listener, normalizeOnProp } from '../state/listeners';
import { useInvokeContext } from './use-core';

// <docs markdown="../readme.md#useOn">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useOn instead)
/**
 * Register a listener on the current component's host element.
 *
 * Used to programmatically add event listeners. Useful from custom `use*` methods, which do not
 * have access to the JSX. Otherwise, it's adding a JSX listener in the `<div>` is a better idea.
 *
 * @see `useOn`, `useOnWindow`, `useOnDocument`.
 *
 * @public
 */
// </docs>
export const useOn = (event: string | string[], eventQrl: QRL<(ev: Event) => void> | undefined) =>
  _useOn(`on-${event}`, eventQrl);

// <docs markdown="../readme.md#useOnDocument">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useOnDocument instead)
/**
 * Register a listener on `document`.
 *
 * Used to programmatically add event listeners. Useful from custom `use*` methods, which do not
 * have access to the JSX.
 *
 * @see `useOn`, `useOnWindow`, `useOnDocument`.
 *
 * ```tsx
 * function useScroll() {
 *   useOnDocument(
 *     'scroll',
 *     $((event) => {
 *       console.log('body scrolled', event);
 *     })
 *   );
 * }
 *
 * const Cmp = component$(() => {
 *   useScroll();
 *   return <div>Profit!</div>;
 * });
 * ```
 *
 * @public
 */
// </docs>
export const useOnDocument = (
  event: string | string[],
  eventQrl: QRL<(ev: Event) => void> | undefined
) => _useOn(`document:on-${event}`, eventQrl);

// <docs markdown="../readme.md#useOnWindow">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useOnWindow instead)
/**
 * Register a listener on `window`.
 *
 * Used to programmatically add event listeners. Useful from custom `use*` methods, which do not
 * have access to the JSX.
 *
 * @see `useOn`, `useOnWindow`, `useOnDocument`.
 *
 * ```tsx
 * function useAnalytics() {
 *   useOnWindow(
 *     'popstate',
 *     $((event) => {
 *       console.log('navigation happened', event);
 *       // report to analytics
 *     })
 *   );
 * }
 *
 * const Cmp = component$(() => {
 *   useAnalytics();
 *   return <div>Profit!</div>;
 * });
 * ```
 *
 * @public
 */
// </docs>
export const useOnWindow = (
  event: string | string[],
  eventQrl: QRL<(ev: Event) => void> | undefined
) => _useOn(`window:on-${event}`, eventQrl);

const _useOn = (eventName: string | string[], eventQrl: QRL<(ev: Event) => void> | undefined) => {
  if (eventQrl) {
    const invokeCtx = useInvokeContext();
    const elCtx = getContext(
      invokeCtx.$hostElement$,
      invokeCtx.$renderCtx$.$static$.$containerState$
    );
    assertQrl(eventQrl);
    if (typeof eventName === 'string') {
      elCtx.li.push([normalizeOnProp(eventName), eventQrl]);
    } else {
      elCtx.li.push(...eventName.map((name) => [normalizeOnProp(name), eventQrl] as Listener));
    }
    elCtx.$flags$ |= HOST_FLAG_NEED_ATTACH_LISTENER;
  }
};
