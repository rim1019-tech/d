import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';

export default function Learn() {
  const nav = useNavigate();
  return (
    <div className="pg">
      <Header crumb="홈 › 배우기" onBack={() => nav('/senior')} title="오늘은 무엇을 연습해 볼까요?" />
      <MenuCard tone={1} icon="🍔" title="무인 주문기 연습" desc="햄버거 가게에서 주문해 봐요." onClick={() => nav('/senior/learn/kiosk')} />
      <MenuCard tone={2} icon="🚆" title="기차·버스 예매" desc="여행할 때 필요한 표를 예매해 봐요." onClick={() => nav('/senior/learn/train')} />
    </div>
  );
}
