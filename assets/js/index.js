/**
 * @file
 * Sets up react app.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/index.scss';
import App from './App';
import socketIOClient from 'socket.io-client';

const rootElement = document.getElementById('reactjs-root');
const socket = socketIOClient(rootElement.getAttribute('data-socket-uri'));
ReactDOM.render(
    <React.StrictMode>
        <App
            token={rootElement.getAttribute('data-token')}
            socket={socket}
        />
    </React.StrictMode>,
    rootElement
);
