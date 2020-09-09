/**
 * @file
 * Sets up react app.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/index.scss';
import App from './App';

let rootElement = document.getElementById('reactjs-root');
ReactDOM.render(
    <React.StrictMode>
        <App token={rootElement.getAttribute('data-token')} socketUri={rootElement.getAttribute('data-socket-uri')} />
    </React.StrictMode>,
    rootElement
);
