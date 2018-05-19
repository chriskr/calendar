import App from './app.js';
window.addEventListener('load', () => {
  const app = new App();
  app.render(...['#root', 'h2'].map(document.querySelector.bind(document)));
  window.__supportsNewJS__ = true;
});
