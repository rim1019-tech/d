import { useNavigate } from 'react-router-dom';
import Btn from '../components/Btn';
import { useToast } from '../components/Toast';
import { USERS } from '../data/users';
import { clearDemoData } from '../services/requests';

export default function Start() {
  const nav = useNavigate();
  const say = useToast();
  return (
    <div className="pg">
      <div style={{ fontSize: 64, textAlign: 'center' }}>🤝</div>
      <h1 style={{ textAlign: 'center' }}>디지털 동행</h1>
      <p style={{ textAlign: 'center', fontSize: 24, fontWeight: 600 }}>
        모르는 순간,
        <br />
        혼자 고민하지 않아도 괜찮아요.
      </p>
      <Btn kind="p" onClick={() => nav('/senior')}>
        👵 어르신으로 시작하기
      </Btn>
      <Btn kind="o" onClick={() => nav('/family')}>
        👨‍👩‍👧 가족으로 시작하기
      </Btn>
      <Btn kind="g" onClick={() => nav('/welfare')}>
        🧑‍💼 사회복지사로 시작하기
      </Btn>
      <p className="sub" style={{ textAlign: 'center' }}>
        시연용 가상 사용자 · 어르신 {USERS.senior} / 가족 {USERS.family} / 복지사 {USERS.welfare}
      </p>
      <p style={{ textAlign: 'center' }}>
        <button
          type="button"
          className="linkbtn"
          onClick={() => {
            clearDemoData();
            say('시연 기록을 지웠어요.');
          }}
        >
          시연 기록 지우기
        </button>
      </p>
    </div>
  );
}
