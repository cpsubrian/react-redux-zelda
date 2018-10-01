import * as React from 'react';
import {Provider} from 'react-redux';
import {store} from '../../data/store';
import {Header} from '../header/Header';
import {Map} from '../map/Map';
import {Toolbar} from '../toolbar/Toolbar';
import './App.css';

const backgroundImageUrl: string = require('./background.jpg');
const mapWidth = 16 * 32;
const mapHeight = 16 * 24;

export class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <div className="app">
          <div className="background" style={{backgroundImage: `url(${backgroundImageUrl})`}} />
          <Header />
          <Map width={mapWidth} height={mapHeight} />
          <Toolbar />
        </div>
      </Provider>
    );
  }
}
