/*@flow*/
import 'lib/fastClick';
// -------------------------------
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'comps/App';
import client from 'lib/apollo';
import { ApolloProvider } from 'react-apollo';
import './index.scss';
import * as serviceWorker from './serviceWorker';

const Providers = props => (
  <ApolloProvider client={client}>{props.children}</ApolloProvider>
);

const node = document.getElementById('root');
node &&
  ReactDOM.render(
    <Providers>
      <App />
    </Providers>,
    node
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
