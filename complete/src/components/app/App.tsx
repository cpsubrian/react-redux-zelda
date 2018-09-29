import * as React from 'react';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';

import './App.css';

export class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <div className="app" />
      </Provider>
    );
  }
}
