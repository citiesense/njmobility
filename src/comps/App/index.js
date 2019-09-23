/*@flow*/
import React from 'react';
import './index.scss';
import Router from 'comps/App/Router';
import { Route, Switch } from 'react-router-dom';
import Home from 'comps/Pages/Home';
import MobilityMap from 'comps/Pages/MobilityMap';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/map" component={MobilityMap} />
      </Switch>
    </div>
  );
}

export default () => (
  <Router>
    <Route path="/" component={App} />
  </Router>
);
