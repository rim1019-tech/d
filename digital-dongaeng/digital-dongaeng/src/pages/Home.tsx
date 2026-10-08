import { useNavigate } from 'react-router-dom';
import Btn from '../components/Btn';
import MenuCard from '../components/MenuCard';
import { RESPONDER_LABEL, callName } from '../data/users';
import { useAppState } from '../hooks/useAppState';

export default function Home() {
  const nav = useNavigate();
  const { quiz, learned, req } = useAppState();
  return (
    <div className="pg">
      <h1>안녕하세요, {callName('senior')}님 👋</h1>
      <p className="sub">모르는 게 생기면 언제든 물어보세요.</p>
      {req?.answer && !req.seen && (
        <Btn kind="o" pulse onClick={() => nav('/senior/ask/answer')}>
          💌 {RESPONDER_LABEL[req.to]}의 답이 도착했어요
        </Btn>
      )}
      <MenuCard tone={1} icon="📚" title="배우기" desc="새로운 일을 천천히 연습해요" onClick={() => nav('/senior/learn')} />
      <MenuCard tone={2} icon="🛡️" title="지키기" desc="오늘의 안전 습관을 배워요" onClick={() => nav('/senior/quiz')} />
      <MenuCard tone={3} icon="💬" title="묻기" desc="어려운 건 가족이나 복지사에게 물어봐요" onClick={() => nav('/senior/ask')} />
      {req && !req.answer && (
        <Btn kind="g" onClick={() => nav('/senior/ask/answer')}>
          ⏳ 답을 기다리는 중이에요
        </Btn>
      )}
      {req?.answer && req.seen && (
        <Btn kind="g" onClick={() => nav('/senior/ask/answer')}>
          💌 받은 답 다시 보기
        </Btn>
      )}
      <div className="mini">
        <div>오늘의 안심 퀴즈 {quiz}/5</div>
        <div>배운 내용 {learned.length}개</div>
      </div>
    </div>
  );
}
