import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BaoVeLoi } from './thanhPhan/BaoVeLoi.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <BaoVeLoi>
    <App />
  </BaoVeLoi>
);
