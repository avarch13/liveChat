import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AppBarCustom from './components/AppBarCustom.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AppBarCustom />
        <App />
    </StrictMode>
);
