// Import 3rd party modules and local.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './components/app/App';

// Import CSS. With Webpack, this is how you include stylesheets in the build.
import './index.css';

// Render our <App /> component into the container. We wrap our app in
// a redux provider, passing it the store.
ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
