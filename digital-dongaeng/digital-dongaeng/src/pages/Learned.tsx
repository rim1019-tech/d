import { useNavigate } from 'react-router-dom';
import Btn from '../components/Btn';
import Header from '../components/Header';
import { useAppState } from '../hooks/useAppState';

export default function Learned() {
  const nav = useNavigate();
  const { learned } = useAppState();
  return (
    <div className="pg">
      <Header crumb="배우기 › 배운 내용" onBack={() => nav('/senior/learn')} title="내가 배운 내용" />
      {learned.length ? learned.map((x) => <div className="card" key={x}>✅ {x}</div>) : <p>아직 없어요. 천천히 시작해 봐요.</p>}
      <Btn onClick={() => nav('/senior/learn')}>배우기 메뉴로 돌아가기</Btn>
    </div>
  );
}
