import * as React from 'react';
import {CELL_SIZE, MAP_WIDTH, MAP_HEIGHT} from '../../constants';
import {Map} from '../map/Map';
import {Toolbar} from '../toolbar/Toolbar';
import './App.css';

/**
 * The main application component handles the overall layout.
 */
export class App extends React.Component {
  public render() {
    return (
      <div className="app">
        <div className="background" />
        <section className="main">
          <header style={{width: MAP_WIDTH}}>
            <h1>React Redux Zelda</h1>
            <span>{process.env.NODE_ENV === 'development' ? 'development' : 'production'}</span>
          </header>
          <div className="editor">
            <Map cellSize={CELL_SIZE} width={MAP_WIDTH} height={MAP_HEIGHT} />
            <Toolbar maxHeight={MAP_HEIGHT} />
          </div>
        </section>
      </div>
    );
  }
}
