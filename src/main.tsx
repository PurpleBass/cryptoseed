import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('[main.tsx] App mounting. navigator.serviceWorker:', 'serviceWorker' in navigator);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);
root.render(<App />);
