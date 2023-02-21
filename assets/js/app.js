/**
 * @file
 * The main entrypoint of the react application.
 */

import React, { useState, useEffect, useRef } from 'react';
import IdleTimer from 'react-idle-timer';
import PropTypes from 'prop-types';
import Bibbox from './steps/bibbox';
import Loading from './steps/loading';
import { IntlProvider } from 'react-intl';
import {
    AppTokenNotValid,
    LoginLoginError,
    ServerError,
    SocketIOOffline,
    SocketIOOfflineAction
} from './steps/utils/formatted-messages';
import { CONNECTION_OFFLINE, CONNECTION_ONLINE } from './constants';
import Alert from "./steps/utils/alert";
import {Spinner} from "react-bootstrap";

/**
 * App. The main entrypoint of the react application.
 *
 * @param uniqueId
 *   The unique id of the configuration to load.
 * @param socket
 *   The socket.
 *
 * @return {*}
 * @constructor
 */
function App({ uniqueId, socket }) {
    const reloadTimeout = 30000;
    const refreshTime = 60 * 60;

    const [socketConnected, setSocketConnected] = useState(null);
    const [machineState, setMachineState] = useState();
    const [boxConfig, setBoxConfig] = useState();
    const [connectionState, setConnectionState] = useState(CONNECTION_OFFLINE);
    const [messages, setMessages] = useState();
    const [errorMessage, setErrorMessage] = useState(null);
    const [language, setLanguage] = useState('en');
    const idleTimerRef = useRef(null);
    const [tokenTimeout, setTokenTimeout] = useState(null);

    /**
     * Set up application with configuration and socket connections.
     */
    useEffect(() => {
        // If loading another config than the last used, remove previous token.
        if (localStorage.getItem('uniqueId') !== uniqueId) {
            removeToken();
        }

        let token = getToken();

        // Get token.
        if (token === false) {
            socket.emit('GetToken', {
                uniqueId: uniqueId
            });
        } else {
            // Token that was not expired was found locally and the client is ready for action.
            socket.emit('ClientReady', {
                token: token
            });
            setupTokenRefresh();
        }

        // Listen for token events.
        socket.on('Token', (data) => {
            if (data.err) {
                setErrorMessage(AppTokenNotValid);
                setTimeout(window.location.reload.bind(window.location), reloadTimeout);
                return;
            }

            token = data.token;
            storeToken(token, data.expire);
            setupTokenRefresh();

            // Signal that the client is ready.
            socket.emit('ClientReady', {
                token: token
            });
        });

        // Listen for refreshed token events.
        socket.on('RefreshedToken', (data) => {
            if (data.err) {
                setErrorMessage(AppTokenNotValid);
                setTimeout(window.location.reload.bind(window.location), reloadTimeout);
                return;
            }

            token = data.token;
            storeToken(token, data.expire);
            setupTokenRefresh();

            // Signal that the frontend has refreshed the token.
            socket.emit('TokenRefreshed', {
                token: token
            });
        });

        // Handle socket reconnections, by sending 'ClientReady' event.
        socket.on('reconnect', (data) => {
            const token = getToken();

            if (token === false) {
                setErrorMessage(AppTokenNotValid);
                setTimeout(window.location.reload.bind(window.location), reloadTimeout);
                return;
            }

            socket.emit('ClientReady', {
                token: token
            });
        });

        socket.on("connect", () => {
            setSocketConnected(true);
        });

        socket.on("disconnect", () => {
            setSocketConnected(false);
        });

        // Handle when FBS is online.
        socket.on('Online', () => {
            setConnectionState(CONNECTION_ONLINE);
        });

        // Handle when FBS is offline.
        socket.on('Offline', () => {
            setConnectionState(CONNECTION_OFFLINE);
        });

        // Out of order from backend
        socket.on('OutOfOrder', () => {
            setErrorMessage(ServerError);
        });

        // Configuration received from backend.
        socket.on('Configuration', (data) => {
            loadTranslations(data.defaultLanguageCode);
            setBoxConfig(data);
        });

        // Listen for changes to machine state.
        socket.on('UpdateState', (data) => {
            // Reset idle timer.
            if (idleTimerRef.current !== null) {
                idleTimerRef.current.reset();
            }
            setMachineState(data);
        });
    }, []);

    /**
     * Handle a user action.
     *
     * @param action
     *   Name of the action
     * @param data
     *   Data for the action
     */
    function handleAction(action, data) {
        const token = getToken();
        if (token === false) {
            setErrorMessage(AppTokenNotValid);
            return;
        }

        // Reset idle timer.
        if (idleTimerRef.current !== null) {
            idleTimerRef.current.reset();
        }

        // If the action is reset, send Reset event, otherwise send Action event.
        if (action === 'reset') {
            socket.emit('ClientEvent', {
                name: 'Reset',
                token: token
            });
        } else {
            socket.emit('ClientEvent', {
                name: 'Action',
                action: action,
                token: token,
                data: data
            });
        }
    }

    /**
     * Handle user being idle.
     */
    function handleIdle() {
        const token = getToken();
        if (token === false) {
            setErrorMessage(AppTokenNotValid);
            return;
        }

        // Return to initial step if not already there.
        if (machineState.step !== 'initial') {
            socket.emit('ClientEvent', {
                name: 'Reset',
                token: token
            });
        } else {
            // Reset the idle timer if already on initial step.
            if (idleTimerRef.current !== null) {
                idleTimerRef.current.reset();
            }
        }
    }

    /**
     * Store token in local storage.
     *
     * @param token
     *   The token to store.
     * @param expire
     *   The expire timestamp for the token.
     */
    function storeToken(token, expire) {
        localStorage.setItem('token', token);
        localStorage.setItem('expire', expire);
        localStorage.setItem('uniqueId', uniqueId);
    }

    /**
     * Remove token from local storage.
     */
    function removeToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('expire');
        localStorage.removeItem('uniqueId');
    }

    /**
     * Register timeout for refreshing token.
     */
    function setupTokenRefresh() {
        const token = localStorage.getItem('token');
        const expire = localStorage.getItem('expire');

        if (tokenTimeout !== null) {
            clearTimeout(tokenTimeout);
        }

        // Refresh the token an hour before expire. Minimum is 30 seconds.
        const nextRefresh = Math.max(expire - Math.floor(Date.now() / 1000) - refreshTime, 30);

        const newTimeout = setTimeout(() => {
            socket.emit('RefreshToken', {
                token: token
            });
        }, nextRefresh * 1000);

        setTokenTimeout(newTimeout);
    }

    /**
     * Get token.
     *
     * @returns {string|boolean}
     *   If token is found and not expired returns string else false
     */
    function getToken() {
        const token = localStorage.getItem('token');
        const expire = localStorage.getItem('expire');

        if (expire === null || token === null) {
            return false;
        }

        const now = Math.floor(Date.now() / 1000);
        const expireParsed = parseInt(localStorage.getItem('expire'));

        if (expireParsed <= now) {
            return false;
        }

        return token;
    }

    /**
     * Setting language and translations.
     *
     * The language should not be set before the translations is loaded, but just after they are load and messages
     * are set. This prevents errors in the console with format message fallback to 'en'.
     *
     * @param data
     *   The translations loaded.
     * @param languageCode
     *   The language code set.
     */
    function activateTranslations(data, languageCode) {
        setMessages(data);
        setLanguage(languageCode);
    }

    /**
     * Load language based on language code.
     *
     * @param languageCode
     *   The local language code to use. Defaults to "en".
     *
     * @returns {Object}
     *   Object with translations.
     */
    function loadTranslations(languageCode) {
        const supportedLanguageCodes = ['da', 'en'];

        // Default to english.
        const selectedLanguageCode = supportedLanguageCodes.includes(languageCode) ? languageCode : 'en';

        import('../../public/lang/' + selectedLanguageCode + '-comp.json').then((data) => {
            activateTranslations(data, languageCode);
        });
    }

    return (
        <IntlProvider locale={language} messages={messages}>
            {socketConnected === false && (
                <div className="container">
                    <div className="alert alert-danger m-5" style={{ width: '100%' }} role="alert">
                        <h3>{SocketIOOffline}</h3>
                        <h5>{SocketIOOfflineAction}</h5>
                        <table>
                            <tr>
                                <td>
                                    <strong>Box Id</strong>
                                </td>
                                <td>
                                    <strong>{boxConfig.uniqueId}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td><Spinner animation={"border"} /></td>
                            </tr>
                        </table>
                    </div>
                </div>
            )}
            {socketConnected !== false && machineState && boxConfig && (
                <div>
                    <IdleTimer ref={idleTimerRef}
                        element={document}
                        onIdle={handleIdle}
                        debounce={500}
                        eventsThrottle={500}
                        timeout={boxConfig.inactivityTimeOut}
                    />
                    <Bibbox
                        boxConfigurationInput={boxConfig}
                        machineStateInput={machineState}
                        errorMessage={errorMessage}
                        connectionState={connectionState}
                        actionHandler={handleAction}
                    />
                </div>
            )}
            {!machineState && !boxConfig && <Loading />}
        </IntlProvider>
    );
}

App.propTypes = {
    uniqueId: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
};

export default App;
