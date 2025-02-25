// App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import NavigationBar from './Components/NavigationBar';
import Router from './router/Router';
import { LanguageProvider } from './Components/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <NavigationBar />
        <div style={{ paddingTop: '80px' }}>
          <Router />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
