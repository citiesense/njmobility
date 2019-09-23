/*@flow*/
import React from 'react';
import { Router } from 'react-router';
import createHistory from './createHistory';
import { type HistoryOpts as Opts } from 'history';

export default class AppRouter extends React.Component<{
  ...$Shape<Opts>,
  children: React$Node,
}> {
  history = createHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}
