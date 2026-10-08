import type { ReactNode } from 'react';

export default function Guide({ children }: { children: ReactNode }) {
  return <div className="guide">👉 {children}</div>;
}
