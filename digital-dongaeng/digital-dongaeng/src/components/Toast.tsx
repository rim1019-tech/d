import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

const Ctx = createContext<(t: string) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [t, setT] = useState('');
  const timer = useRef<number | undefined>(undefined);
  const say = useCallback((m: string) => {
    setT(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setT(''), 2800);
  }, []);
  return (
    <Ctx.Provider value={say}>
      {children}
      {t && (
        <div className="toast" role="status">
          {t}
        </div>
      )}
    </Ctx.Provider>
  );
}
