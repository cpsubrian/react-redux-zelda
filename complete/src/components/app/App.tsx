import * as React from 'react';
import {CELL_SIZE, MAP_WIDTH, MAP_HEIGHT} from '../../constants';
import {Map} from '../map/Map';
import {Toolbar} from '../toolbar/Toolbar';
import './App.css';

export class App extends React.Component {
  public render() {
    return (
      <div className="app">
        <div className="background" />
        <div className="main">
          <header>
            <h1>React Redux Zelda</h1>
          </header>
          <Map cellSize={CELL_SIZE} width={MAP_WIDTH} height={MAP_HEIGHT} />
          <footer>
            {process.env.NODE_ENV === 'development' ? <span>[ development ]</span> : null}
          </footer>
        </div>
        <Toolbar />
      </div>
    );
  }
}
