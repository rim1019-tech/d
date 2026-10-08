import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Btn from '../components/Btn';
import Header from '../components/Header';
import Progress from '../components/Progress';
import { QUIZ } from '../data/quiz';
import { setQuizProgress } from '../services/requests';

const MARK = ['①', '②', '③'];

export default function Quiz() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [fin, setFin] = useState(false);
  const q = QUIZ[i];
  const back = () => nav('/senior');

  if (fin)
    return (
      <div className="pg">
        <Header crumb="지키기 › 완료" onBack={back} />
        <div className="msg">
          <div className="t">🌱 오늘의 안심 퀴즈를 모두 풀었어요!</div>
          <p>오늘의 안심 퀴즈 5/5</p>
        </div>
        <Progress v={5} max={5} />
        <Btn kind="p" onClick={() => { setI(0); setSel(null); setFin(false); }}>다시 풀어보기</Btn>
        <Btn onClick={back}>🏠 홈으로 가기</Btn>
      </div>
    );

  const pick = (k: number) => {
    if (sel !== null) return;
    setSel(k);
    setQuizProgress(i + 1);
  };
  return (
    <div className="pg">
      <Header crumb={`지키기 › 안심 퀴즈 ${i + 1}/5`} onBack={back} />
      <Progress v={i + (sel !== null ? 1 : 0)} max={5} />
      <h2>{q.q}</h2>
      {q.o.map((o, k) => (
        <button type="button" key={k} className={`opt ${sel !== null ? (k === q.a ? 'ok' : k === sel ? '' : 'no') : ''}`} onClick={() => pick(k)}>
          {MARK[k]} {o}
        </button>
      ))}
      {sel !== null && (
        <div>
          <div className="card">
            <h2>{sel === q.a ? '잘했어요! 🌱' : '괜찮아요. 함께 다시 알아볼까요?'}</h2>
            <p>{sel === q.a ? '' : `올바른 행동은 “${q.o[q.a]}”예요. `}{q.e}</p>
          </div>
          <Btn kind="p" onClick={() => (i === 4 ? setFin(true) : (setI(i + 1), setSel(null)))}>{i === 4 ? '결과 보기' : '다음 문제'}</Btn>
        </div>
      )}
    </div>
  );
}
