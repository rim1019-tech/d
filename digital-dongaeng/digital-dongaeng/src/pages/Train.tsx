import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Btn from '../components/Btn';
import Guide from '../components/Guide';
import Header from '../components/Header';
import Progress from '../components/Progress';
import { useToast } from '../components/Toast';
import { TRAIN_STEPS } from '../data/train';
import { addLearned } from '../services/requests';

const GENTLE = '괜찮아요. 천천히 다시 찾아볼까요?';
const LAST = TRAIN_STEPS.length; // 5 = 확인 단계, 6 = 완료

export default function Train() {
  const nav = useNavigate();
  const say = useToast();
  const [st, setSt] = useState(0);
  const [pk, setPk] = useState<string[]>([]);
  const [msg, setMsg] = useState('');

  const reset = () => {
    setSt(0);
    setPk([]);
    setMsg('');
  };
  const tap = (o: string) => {
    const s = TRAIN_STEPS[st];
    if (s && o === s.o[s.t]) {
      setMsg('');
      setPk([...pk, o]);
      setSt(st + 1);
    } else setMsg(GENTLE);
  };

  if (st === LAST + 1)
    return (
      <div className="pg">
        <Header crumb="배우기 › 기차·버스 › 완료" />
        <div className="msg">
          <div className="t">잘했어요! 🎉</div>
          <p>기차표 예매 과정을 연습했어요.</p>
          <p className="sub">{pk[0]} → {pk[1]} · {pk[2]} {pk[3]} · {pk[4]}</p>
        </div>
        <Btn kind="p" onClick={reset}>다시 연습하기</Btn>
        <Btn kind="g" onClick={() => nav('/senior/learn/done')}>배운 내용 확인하기</Btn>
        <Btn onClick={() => nav('/senior/learn')}>배우기 메뉴로 돌아가기</Btn>
        <Btn onClick={() => nav('/senior')}>🏠 홈으로 가기</Btn>
      </div>
    );

  if (st === LAST)
    return (
      <div className="pg">
        <Header crumb="배우기 › 기차·버스 › 6/6단계" onBack={() => { setSt(st - 1); setPk(pk.slice(0, -1)); setMsg(''); }} />
        <Progress v={5} max={6} />
        <Guide>내용이 맞는지 보고, “예매 확인(연습)”을 눌러볼까요?</Guide>
        {msg && <div className="soft">{msg}</div>}
        <div className="card">
          <h2>예매 정보 확인</h2>
          {[`출발 ${pk[0]}`, `도착 ${pk[1]}`, `날짜 ${pk[2]}`, `시간 ${pk[3]}`, `자리 ${pk[4]}`].map((x) => <div className="row" key={x}>{x}</div>)}
        </div>
        <Btn kind="o" pulse onClick={() => { addLearned('기차표 예매하기'); say('연습을 마쳤어요 🎉'); setSt(LAST + 1); }}>예매 확인(연습)</Btn>
        <Btn onClick={() => { reset(); setMsg('괜찮아요. 처음부터 다시 해볼까요?'); }}>처음부터 다시 하기</Btn>
      </div>
    );

  const s = TRAIN_STEPS[st];
  return (
    <div className="pg">
      <Header
        crumb={`배우기 › 기차·버스 › ${st + 1}/6단계`}
        onBack={st > 0 ? () => { setSt(st - 1); setPk(pk.slice(0, -1)); setMsg(''); } : () => nav('/senior/learn')}
      />
      <Progress v={st} max={6} />
      <Guide>다음에는 어디를 눌러볼까요? “{s.o[s.t]}”을(를) 찾아보세요. 깜빡이는 버튼이에요.</Guide>
      {msg && <div className="soft">{msg}</div>}
      <h2>🚆 {s.q}</h2>
      {s.o.map((o) => (
        <button type="button" key={o} className={`opt${o === s.o[s.t] ? ' pulse' : ''}`} onClick={() => tap(o)}>{o}</button>
      ))}
    </div>
  );
}
