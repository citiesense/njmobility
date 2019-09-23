/*@flow*/
import React from 'react';
import logo from 'images/citi-logo.svg';
import { Link } from 'react-router-dom';
// import { hot } from 'react-hot-loader/root';

export default function Home() {
  return (
    <div>
      <header className="App-header">
        <Link to="/map" className="btn btn-link">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="mt-3 text-info h3">Spark</div>
        </Link>
      </header>
    </div>
  );
}
