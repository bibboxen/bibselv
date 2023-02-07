/**
 * @file
 * Sets up react app.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/index.scss';
import App from './app';
import socketIOClient from 'socket.io-client';

const rootElement = document.getElementById('reactjs-root');
const socket = socketIOClient(rootElement.getAttribute('data-socket-uri'));

ReactDOM.render(
    <React.StrictMode>
        <App
            uniqueId={rootElement.getAttribute('data-unique-id')}
            socket={socket}
        />
    </React.StrictMode>,
    rootElement
);

// Initialize web worker to check for unresponsive frontend.
// If it is unresponsive, reload the page.
if (window.Worker) {
    const myWorker = new Worker('../worker.js');

    myWorker.onmessage = function(e) {
        switch (e?.data) {
            case 'reload':
                window.location.reload();
                break;
            case 'ping':
                myWorker.postMessage('pong');
                break;
        }
    };
} else {
    console.warn('Your browser does not support web workers.');
}
