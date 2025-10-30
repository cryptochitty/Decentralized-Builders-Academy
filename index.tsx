// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';               // NEW
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

// `createRoot` is the modern API (React 18+)
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);