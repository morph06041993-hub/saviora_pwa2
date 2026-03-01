import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
// Импортируем твой существующий провайдер
import { AuthProvider } from './features/auth/AuthProvider'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* <--- ДОБАВИТЬ ЭТО */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider> {/* <--- И ЭТО */}
  </React.StrictMode>,
);