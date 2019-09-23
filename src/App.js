/*@flow*/
import React from 'react';
import logo from './citi-logo.svg';
import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button className="btn btn-link">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="mt-3 text-info h3">Spark</div>
        </button>
      </header>
    </div>
  );
}

export default App;
