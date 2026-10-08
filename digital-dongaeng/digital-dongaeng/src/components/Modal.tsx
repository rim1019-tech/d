import type { ReactNode } from 'react';

export default function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="mask">
      <div className="modal" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}
