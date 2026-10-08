import { useNavigate } from 'react-router-dom';

interface Props {
  crumb: string;
  title?: string;
  onBack?: () => void;
  /** 뒤로가기가 있으면 기본으로 "홈" 버튼도 함께 보여줘요 */
  showHome?: boolean;
}

export default function Header({ crumb, title, onBack, showHome = true }: Props) {
  const nav = useNavigate();
  return (
    <div>
      <div className="hd">
        {onBack && (
          <button type="button" className="back" onClick={onBack} aria-label="뒤로가기">
            ← 뒤로
          </button>
        )}
        {onBack && showHome && (
          <button type="button" className="back hm" onClick={() => nav('/senior')} aria-label="홈으로 가기">
            🏠 홈
          </button>
        )}
        <div className="crumb" style={{ width: '100%' }}>
          {crumb}
        </div>
      </div>
      {title && <h1>{title}</h1>}
    </div>
  );
}
