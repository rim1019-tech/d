import { useSyncExternalStore } from 'react';
import { store } from '../services/store';

export function useAppState() {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
