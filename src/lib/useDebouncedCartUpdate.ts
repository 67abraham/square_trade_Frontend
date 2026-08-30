import { useRef, useCallback } from 'react';
import {updateCartItem } from '../lib/api/cart'



export function useDebouncedCartUpdate(delay = 500) {
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const controllers = useRef<Map<string, AbortController>>(new Map());

  const scheduleUpdate = useCallback((id: string, quantity: number, onError?: (err: unknown) => void) => {
    const existingTimer = timers.current.get(id);
    if (existingTimer) clearTimeout(existingTimer);

    const existingController = controllers.current.get(id);
    if (existingController) existingController.abort();

    const timer = setTimeout(async () => {
      const controller = new AbortController();
      controllers.current.set(id, controller);
      try {
        await updateCartItem(id, quantity, controller.signal);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError' && err.name !== 'CanceledError') {
          onError?.(err);
        }
      } finally {
        controllers.current.delete(id);
        timers.current.delete(id);
      }
    }, delay);

    timers.current.set(id, timer);
  }, [delay]);

    const cancelUpdate = useCallback((id: string) => {
    const existingTimer = timers.current.get(id);
    if (existingTimer) clearTimeout(existingTimer);
    timers.current.delete(id);

    const existingController = controllers.current.get(id);
    if (existingController) existingController.abort();
    controllers.current.delete(id);
  }, []);

  return {scheduleUpdate, cancelUpdate};
}