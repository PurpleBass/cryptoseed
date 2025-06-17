import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupNonce } from './lib/nonceGenerator';

// Generate a nonce for this page load
const nonce = setupNonce();

// Add the nonce to any script tags that need it
document.querySelectorAll('script').forEach(script => {
  if (script.getAttribute('nonce') === null) {
    script.setAttribute('nonce', nonce);
  }
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);
root.render(<App />);
