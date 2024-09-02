import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

document.addEventListener('DOMContentLoaded', () => {
  if ('windowControlsOverlay' in navigator) {
    navigator.windowControlsOverlay.addEventListener('geometrychange', () => {
      const overlayRect = navigator.windowControlsOverlay.getTitlebarAreaRect();
      const overlayVisible = navigator.windowControlsOverlay.visible;

      if (overlayVisible) {
        const customTitleBar = document.querySelector('#custom-title-bar');
        customTitleBar.style.paddingLeft = `${overlayRect.x}px`;
        customTitleBar.style.paddingTop = `${overlayRect.y}px`;
        customTitleBar.style.height = `${overlayRect.height}px`;
      }
    });
  }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
