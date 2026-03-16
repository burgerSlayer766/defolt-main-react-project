import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/index.scss';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    // Проверка для разработки
    <React.StrictMode>
        <App />
    </React.StrictMode>
);