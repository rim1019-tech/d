import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Btn from '../components/Btn';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import { LEVEL_LABEL } from '../data/analysis';
import { RESPONDER_LABEL, USERS } from '../data/users';
import { analyzeMessage } from '../services/aiClient';
import { createRequest } from '../services/requests';
import type { Analysis, Draft, Responder } from '../types';

const MIN_WAIT_MS = 1800; // "읽는 중" 화면이 너무 번쩍이지 않게

export default function Analyze() {
  const nav = useNavigate();
  const loc = useLocation();
  const draft = (loc.state as { draft?: Draft } | null)?.draft;
  if (!draft) return <Navigate to="/senior/ask" replace />;
  return <AnalyzeView draft={draft} back={() => nav('/senior/ask')} />;
}

function AnalyzeView({ draft, back }: { draft: Draft; back: () => void }) {
  const nav = useNavigate();
  const say = useToast();
  const [r, setR] = useState<Analysis | null>(null);
  const [to, setTo] = useState<Responder | null>(null);
  const [pic, setPic] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([analyzeMessage({ img: draft.img, text: draft.text }), new Promise((x) => setTimeout(x, MIN_WAIT_MS))]).then(([a]) => {
      if (alive) {
        setR(a);
        setPic(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [draft]);

  const shot = draft.img ? (
    <img className="shot" style={{ maxHeight: 240 }} src={draft.img} alt="가져온 문자 사진" />
  ) : (
    <div className="sms">{(draft.text ?? '').split('\n').map((l, k) => <div key={k}>{l}</div>)}</div>
  );

  return (
    <div className="pg">
      <Header crumb="묻기 › 도우미가 읽어 드려요" onBack={back} />
      {!r ? (
        <div>
          {shot}
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>문자를 읽고 있어요</h2>
            <p className="sub">잠깐만 기다려 주세요.</p>
            <div className="dots"><span /><span /><span /></div>
          </div>
        </div>
      ) : (
        <div>
          <div className="sec"><h3>📖 무슨 내용인가요?</h3><p><b>{r.easy}</b></p></div>
          <div className="sec w">
            <h3>⚠️ 조금 조심할 부분</h3>
            <p>{LEVEL_LABEL[r.level]}</p>
            {r.signs.length ? <ul>{r.signs.map((x, k) => <li key={k}>{x}</li>)}</ul> : <p>눈에 띄는 위험 신호는 많지 않아요. 그래도 확인해 봐요.</p>}
          </div>
          <div className="sec"><h3>👉 어떻게 하면 좋을까요?</h3><ol>{r.actions.map((x, k) => <li key={k}>{x}</li>)}</ol></div>
          <p className="sub">도우미(AI)는 위험 신호만 알려 줘요. 맞는지 아닌지는 정할 수 없어요.{r.ai ? '' : ' (시연용 예시 분석)'}</p>
          <h2>누구에게 물어볼까요?</h2>
          <Btn kind="o" onClick={() => setTo('family')}>👨‍👩‍👧 가족에게 물어보기</Btn>
          <Btn kind="g" onClick={() => setTo('welfare')}>🧑‍💼 사회복지사에게 물어보기</Btn>
          <Btn onClick={() => setPic(!pic)}>{pic ? '📄 문자 사진 접기' : '📄 문자 사진 다시 보기'}</Btn>
          {pic && shot}
        </div>
      )}
      {to && r && (
        <Modal>
          <h2>{USERS[to]}님에게 확인 요청을 보낼까요?</h2>
          <p className="sub">{RESPONDER_LABEL[to]}에게 가는 연습이에요. 실제 문자는 전송되지 않아요.</p>
          <Btn kind="p" onClick={() => { createRequest(to, draft, r); say('확인 요청을 보냈어요.'); nav('/senior/ask/answer'); }}>네, 보낼게요</Btn>
          <Btn onClick={() => setTo(null)}>아니요, 다음에 할게요</Btn>
        </Modal>
      )}
    </div>
  );
}
