import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';
import { ToastProvider } from './Toast';

// ?demo=0 으로 접속하면 위쪽 "시연 화면" 전환 바를 숨겨요. (실제 사용자에게 링크를 줄 때)
const SHOW_DEMO_BAR = typeof window === 'undefined' || new URLSearchParams(window.location.search).get('demo') !== '0';

const TABS = [
  { to: '/', label: '처음', match: (p: string) => p === '/' },
  { to: '/senior', label: '어르신', match: (p: string) => p.startsWith('/senior') },
  { to: '/family', label: '가족', match: (p: string) => p === '/family' },
  { to: '/welfare', label: '복지사', match: (p: string) => p === '/welfare' },
];

export default function Shell() {
  const { pathname } = useLocation();
  const { req } = useAppState();
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <ToastProvider>
      <div className="app">
        {SHOW_DEMO_BAR && (
          <nav className="rolebar" aria-label="시연 화면 전환">
            <span>시연 화면</span>
            {TABS.map((t) => {
              const badge = req && !req.answer && ((t.to === '/family' && req.to === 'family') || (t.to === '/welfare' && req.to === 'welfare'));
              return (
                <Link key={t.to} to={t.to} className={t.match(pathname) ? 'on' : ''}>
                  {t.label}
                  {badge ? ' ●' : ''}
                </Link>
              );
            })}
          </nav>
        )}
        <main>
          <Outlet />
        </main>
        <p className="disclaimer">현재 서비스는 시연용 프로토타입입니다. 실제 개인정보를 입력하지 마세요.</p>
      </div>
    </ToastProvider>
  );
}
