import * as React from 'react';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {CELL_SIZE, MAP_WIDTH, MAP_HEIGHT} from '../../constants';
import {Header} from '../header/Header';
import {Map} from '../map/Map';
import {Toolbar} from '../toolbar/Toolbar';
import './App.css';

export class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <div className="app">
          <Header />
          <Map cellSize={CELL_SIZE} width={MAP_WIDTH} height={MAP_HEIGHT} />
          <Toolbar />
        </div>
      </Provider>
    );
  }
}
