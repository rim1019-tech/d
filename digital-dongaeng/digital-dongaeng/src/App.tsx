import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/Shell';
import Analyze from './pages/Analyze';
import Answer from './pages/Answer';
import Ask from './pages/Ask';
import Guardian from './pages/Guardian';
import Home from './pages/Home';
import Kiosk from './pages/Kiosk';
import Learn from './pages/Learn';
import Learned from './pages/Learned';
import Quiz from './pages/Quiz';
import Start from './pages/Start';
import Train from './pages/Train';

/**
 * 주소 구조 (공유하기 쉬운 URL)
 *  /            시작 화면
 *  /senior      어르신 홈 (…/learn, …/quiz, …/ask)
 *  /family      가족 화면
 *  /welfare     사회복지사 화면
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Start />} />
        <Route path="senior">
          <Route index element={<Home />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/kiosk" element={<Kiosk />} />
          <Route path="learn/train" element={<Train />} />
          <Route path="learn/done" element={<Learned />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="ask" element={<Ask />} />
          <Route path="ask/analyze" element={<Analyze />} />
          <Route path="ask/answer" element={<Answer />} />
        </Route>
        <Route path="family" element={<Guardian who="family" />} />
        <Route path="welfare" element={<Guardian who="welfare" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
