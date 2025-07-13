/**
 * Utility functions to prevent hydration mismatches
 */

/**
 * Hook to check if component is mounted on client side
 * Use this for components that need to wait for client hydration
 */
import { useEffect, useState } from 'react';

export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook to safely access window object
 * Returns undefined during SSR, window object after hydration
 */
export function useSafeWindow() {
  const [windowObj, setWindowObj] = useState(undefined);

  useEffect(() => {
    setWindowObj(window);
  }, []);

  return windowObj;
}

/**
 * Hook to safely access localStorage
 * Returns null during SSR, localStorage after hydration
 */
export function useSafeLocalStorage() {
  const [localStorage, setLocalStorage] = useState(null);

  useEffect(() => {
    setLocalStorage(window.localStorage);
  }, []);

  return localStorage;
}
