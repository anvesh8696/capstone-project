import React, { Component } from 'react';
import { syncHistoryWithStore } from 'react-router-redux';
import { hashHistory, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { createStore } from '../../store';
import Routes from 'components/routes/Routes';

const store = createStore({}, useRouterHistory(createHashHistory)({ queryKey: false }));
const history = syncHistoryWithStore(hashHistory, store);

export const dispatch = store.dispatch;

export default class App extends Component {
  
  render() {
    return (
      <Routes
        store = {store}
        history = {history}
      />
    );
  }
}
