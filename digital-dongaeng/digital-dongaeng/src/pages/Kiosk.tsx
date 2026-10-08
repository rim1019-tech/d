import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Btn from '../components/Btn';
import Guide from '../components/Guide';
import Header from '../components/Header';
import Progress from '../components/Progress';
import { useToast } from '../components/Toast';
import { BRAND, ITEMS, KIOSK_GUIDES, KIOSK_TARGETS } from '../data/kiosk';
import { addLearned } from '../services/requests';

const GENTLE = '괜찮아요. 천천히 다시 찾아볼까요?';

export default function Kiosk() {
  const nav = useNavigate();
  const say = useToast();
  const [st, setSt] = useState(0);
  const [cart, setCart] = useState<string[]>([]);
  const [msg, setMsg] = useState('');

  const reset = () => {
    setSt(0);
    setCart([]);
    setMsg('');
  };
  const tap = (id: string) => {
    if (id !== KIOSK_TARGETS[st]) return setMsg(GENTLE);
    setMsg('');
    if (id === 'burger' || id === 'cola') setCart((c) => [...c, id]);
    if (st === 4) {
      addLearned('무인 주문기로 햄버거 주문하기');
      say('연습을 마쳤어요 🎉');
    }
    setSt(st + 1);
  };
  const pu = (id: string) => (KIOSK_TARGETS[st] === id ? ' pulse' : '');
  const total = cart.reduce((a, id) => a + (ITEMS.find((x) => x.id === id)?.p ?? 0), 0);

  if (st >= 5)
    return (
      <div className="pg">
        <Header crumb="배우기 › 무인 주문기 › 완료" />
        <div className="msg">
          <div className="t">잘했어요! 🎉</div>
          <p>직접 주문하는 방법을 연습했어요.</p>
        </div>
        <Btn kind="p" onClick={reset}>다시 연습하기</Btn>
        <Btn kind="g" onClick={() => nav('/senior/learn/done')}>배운 내용 확인하기</Btn>
        <Btn onClick={() => nav('/senior/learn')}>배우기 메뉴로 돌아가기</Btn>
        <Btn onClick={() => nav('/senior')}>🏠 홈으로 가기</Btn>
      </div>
    );

  return (
    <div className="pg">
      <Header crumb={`배우기 › 무인 주문기 › ${st + 1}/5단계`} onBack={() => nav('/senior/learn')} />
      <Progress v={st} max={5} />
      <Guide>{KIOSK_GUIDES[st]}</Guide>
      {msg && <div className="soft">{msg}</div>}
      <div className="kiosk">
        <div className="top">{BRAND} · 연습용 주문기</div>
        {st < 3 && (
          <div>
            <div className="grid">
              {ITEMS.map((i) => (
                <button type="button" key={i.id} className={`it${pu(i.id)}`} onClick={() => tap(i.id)}>
                  <span>{i.e}</span>
                  {i.n}
                  <small>{i.p.toLocaleString()}원</small>
                </button>
              ))}
            </div>
            <button type="button" className={`b p${pu('cartbtn')}`} onClick={() => tap('cartbtn')}>
              🛒 장바구니 보기 ({cart.length}개)
            </button>
          </div>
        )}
        {st === 3 && (
          <div>
            <h2 style={{ color: '#222' }}>내가 고른 것</h2>
            {cart.map((id, k) => {
              const x = ITEMS.find((y) => y.id === id)!;
              return (
                <div className="row" key={k}>
                  <span>{x.e} {x.n}</span>
                  <b>{x.p.toLocaleString()}원</b>
                </div>
              );
            })}
            <div className="row"><b>합계</b><b>{total.toLocaleString()}원</b></div>
            <button type="button" className={`b o${pu('order')}`} onClick={() => tap('order')}>주문하기</button>
            <button type="button" className="b" onClick={() => { reset(); setMsg('괜찮아요. 처음부터 다시 골라 볼까요?'); }}>처음부터 다시 고르기</button>
          </div>
        )}
        {st === 4 && (
          <div>
            <h2 style={{ color: '#222' }}>어떻게 낼까요?</h2>
            <p style={{ color: '#444' }}>연습이라서 돈은 나가지 않아요.</p>
            <button type="button" className={`b o${pu('card')}`} onClick={() => tap('card')}>💳 카드로 내기(연습)</button>
            <button type="button" className="b" onClick={() => tap('cash')}>💵 현금으로 내기</button>
          </div>
        )}
      </div>
    </div>
  );
}
