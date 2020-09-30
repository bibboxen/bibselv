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
    const [translations, setTranslations] = useState();
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
        socket.on('Configuration', (data) => {
            setTranslations(loadLocaleData('en'));
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
     *
     * @param locale
     *
     * @returns {Promise<{"banner-header-book-with-fine": *, "banner-heaeder-book-for-check-in": *, "book-is-registered": *, "button-navbar-check-in": *, "button-navbar-check-out": *, "button-navbar-finish": *, "button-navbar-status": *, "check-in-items-help-box-text": *, "check-in-items-input-label": *, "check-out-items-help-box-text": *, "check-out-items-input-label": *, "help-box-header": *, "initial-button-check-in": *, "initial-button-check-out": *, "initial-button-status": *, "initial-choose-a-function": *, "login-not-configured": *, "scan-login-help-box-text": *, "scan-login-password-input-label": *, "scan-login-password-password-help-box-text": *, "scan-login-password-password-subheader": *, "scan-login-password-usename-help-box-text": *, "status-header-current-loans": *, "status-header-ready-for-pickup": *, "status-header-reservations": *}>|Promise<{"banner-header-book-with-fine": *, "banner-heaeder-book-for-check-in": *, "book-is-registered": *, "button-navbar-check-in": *, "button-navbar-check-out": *, "button-navbar-finish": *, "button-navbar-status": *, "check-in-items-help-box-text": *, "check-in-items-input-label": *, "check-out-items-help-box-text": *, "check-out-items-input-label": *, "help-box-header": *, "initial-button-check-in": *, "initial-button-check-out": *, "initial-button-status": *, "initial-choose-a-function": *, "login-not-configured": *, "scan-login-help-box-text": *, "scan-login-password-input-label": *, "scan-login-password-password-help-box-text": *, "scan-login-password-password-subheader": *, "scan-login-password-usename-help-box-text": *, "status-header-current-loans": *, "status-header-ready-for-pickup": *, "status-header-reservations": *}>}
     */
    function loadLocaleData(locale) {
        switch (locale) {
            case 'da':
                return import('../../public/lang/da-comp.json')
            default:
                return import('../../public/lang/en-comp.json')
        }
    }

    return (
        <IntlProvider locale="da" translations={translations}>
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
