/**
 * SSR-safe storage for redux-persist.
 *
 * redux-persist/lib/storage uses localStorage which doesn't exist during SSR,
 * causing the warning: "redux-persist failed to create sync storage.
 * falling back to noop storage."
 *
 * This custom storage uses localStorage on the client and a noop on the server,
 * silently avoiding the warning.
 */

export const storage = {
  getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return Promise.resolve(null);
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem(key: string): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};