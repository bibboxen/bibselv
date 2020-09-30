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
function App({ token, socket }) {
    const [machineState, setMachineState] = useState();
    const [boxConfig, setBoxConfig] = useState();
    const [messages, setMessages] = useState();
    const [language, setLanguage] = useState('en');
    const idleTimerRef = useRef(null);

    /**
     * Set up application with configuration and socket connections.
     */
    useEffect(() => {
        // Signal that the client is ready.
        socket.emit('ClientReady', {
            token: token
        });

        // Handle socket reconnections, by sending 'ClientReady' event.
        socket.on('reconnect', (data) => {
            socket.emit('ClientReady', {
                token: token
            });
        });

        // Configuration received from backend.
        socket.on('Configuration', async (data) => {
            loadTranslations(data.defaultLanguageCode);
            setLanguage(data.defaultLanguageCode);
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
     * Load language based on language code.
     *
     * @param languageCode
     *   The local language code to use. Defaults to "en".
     *
     * @returns {Object}
     *   Object with translations.
     */
     function loadTranslations(languageCode) {
        switch (languageCode) {
            case 'da':
                import('../../public/lang/da-comp.json').then((data) => {
                    setMessages(data)
                });
                break;

            default:
                // Fallback to english.
                import('../../public/lang/en-comp.json').then((data) => {
                    setMessages(data)
                });
                break;
        }
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
    token: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
};

export default App;
