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

/**
 * App. The main entrypoint of the react application.
 *
 * @param token
 *   Token, the identifier that connects to the backend
 * @param socket
 *   The socket.
 *
 * @return {*}
 * @constructor
 */
function App({ uniqueId, socket }) {
    const [machineState, setMachineState] = useState();
    const [boxConfig, setBoxConfig] = useState();
    const [messages, setMessages] = useState();
    const [language, setLanguage] = useState('en');
    const idleTimerRef = useRef(null);

    /**
     * Set up application with configuration and socket connections.
     */
    useEffect(() => {
        let token = getToken();

        // Get token. @TODO: Login to ensure
        if (false === token) {
            socket.emit('GetToken', {
                uniqueId: uniqueId
            });
        }
        else {
            // Token that was not expired was found locally and the client is ready for action.
            socket.emit('ClientReady', {
                token: token
            });
        }

        // Listen for token events.
        socket.on('Token', (data) => {
            token = data.token;
            storeToken(token, data.expire);

            // Signal that the client is ready.
            socket.emit('ClientReady', {
                token: token
            });
        });

        // Handle socket reconnections, by sending 'ClientReady' event.
        socket.on('reconnect', (data) => {
            socket.emit('ClientReady', {
                token: token
            });
        });

        // Configuration received from backend.
        socket.on('Configuration', (data) => {
            loadTranslations(data.defaultLanguageCode);
            setBoxConfig(data);
        });

        // Listen for changes to machine state.
        socket.on('UpdateState', (data) => {
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
     * Store token local.
     *
     * @param token
     * @param expire
     */
    function storeToken(token, expire) {
        localStorage.setItem('token', token);
        localStorage.setItem('expire', expire);
    }

    /**
     * Get token.
     *
     * @returns {boolean|string}
     *   If token exists local and is not expired it's returned else false.
     */
    function getToken() {
        const now = Math.floor(Date.now() / 1000);
        const expire = parseInt(localStorage.getItem('expire'));
        if (parseInt(expire) <= now) {
            return false;
        }

        const token = localStorage.getItem('token')
        return token !== null ? token : false;
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
            {machineState && boxConfig && (
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
