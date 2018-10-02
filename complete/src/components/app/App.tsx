import * as React from 'react';
import {Provider} from 'react-redux';
import {store} from '../../data/store';
import {Map} from '../map/Map';
import {Toolbar} from '../toolbar/Toolbar';
import './App.css';

const backgroundImageUrl: string = require('./background.jpg');
const cellSize = 16;
const mapWidth = cellSize * 48;
const mapHeight = cellSize * 32;

export class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <div className="app">
          <div className="background" style={{backgroundImage: `url(${backgroundImageUrl})`}} />
          <Map cellSize={cellSize} width={mapWidth} height={mapHeight} />
          <Toolbar />
        </div>
      </Provider>
    );
  }
}
