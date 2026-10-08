import type { ReactNode } from 'react';

export default function MenuCard({ tone, icon, title, desc, onClick }: { tone: 1 | 2 | 3; icon: string; title: ReactNode; desc: string; onClick: () => void }) {
  return (
    <button type="button" className={`b big t${tone}`} onClick={onClick}>
      <span className="ic">{icon}</span>
      <span>
        {title}
        <small>{desc}</small>
      </span>
    </button>
  );
}
