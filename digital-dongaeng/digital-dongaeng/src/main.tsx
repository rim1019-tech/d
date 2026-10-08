import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

// 파일을 내려받아 더블클릭(file://)으로 열었을 때는 주소 방식이 달라서 HashRouter(#/주소)를 써요.
const Router = window.location.protocol === 'file:' ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <Router>
    <App />
  </Router>,
);
