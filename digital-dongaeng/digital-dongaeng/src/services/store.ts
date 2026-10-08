/**
 * 데모용 저장소 (브라우저 localStorage).
 *
 * 나중에 Supabase 같은 백엔드를 붙일 때는 이 파일의 `store` 구현만 바꾸면 됩니다.
 * (화면 코드는 services/requests.ts 의 함수와 hooks/useAppState 만 사용해요.)
 *
 * 개인정보 보호: 사진은 확인 요청이 있는 동안에만 보관하고, 2시간이 지나면 자동으로 지워요.
 */
import type { AppState } from '../types';

const KEY = 'dh_state_v2';
const TTL_MS = 2 * 60 * 60 * 1000;
const EMPTY: AppState = { quiz: 0, learned: [], req: null };

let storageOk = true;
let mem: string | null = null;
let lastRaw: string | null | undefined;
let snap: AppState = EMPTY;
const listeners = new Set<() => void>();

function readRaw(): string | null {
  if (!storageOk) return mem;
  try {
    return localStorage.getItem(KEY);
  } catch {
    storageOk = false;
    return mem;
  }
}

function parse(raw: string | null): AppState {
  if (!raw) return EMPTY;
  try {
    const o = { ...EMPTY, ...JSON.parse(raw) } as AppState;
    if (o.req && Date.now() - o.req.id > TTL_MS) o.req = null;
    return o;
  } catch {
    return EMPTY;
  }
}

function get(): AppState {
  const raw = readRaw();
  if (raw !== lastRaw) {
    lastRaw = raw;
    snap = parse(raw);
  }
  return snap;
}

function write(next: AppState) {
  const raw = JSON.stringify(next);
  mem = raw;
  if (storageOk) {
    try {
      localStorage.setItem(KEY, raw);
    } catch {
      storageOk = false; // 저장 공간 부족 등: 이 탭 안에서만 동작
    }
  }
  lastRaw = raw;
  snap = next;
  listeners.forEach((f) => f());
}

let bound = false;
function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!bound && typeof window !== 'undefined') {
    bound = true;
    // 다른 탭(가족 화면 등)에서 바뀐 내용을 받아요.
    window.addEventListener('storage', (e) => {
      if (e.key === KEY || e.key === null) listeners.forEach((f) => f());
    });
  }
  return () => {
    listeners.delete(cb);
  };
}

export const store = {
  get,
  subscribe,
  update(fn: (s: AppState) => AppState) {
    write(fn(get()));
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    mem = null;
    write(EMPTY);
  },
};
