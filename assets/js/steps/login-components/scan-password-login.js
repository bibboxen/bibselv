/**
 * @file
 * For users that scans username and types password to login.
 */

import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/header';
import PropTypes from 'prop-types';
import { faExclamationTriangle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import BarcodeScanner from '../utils/barcode-scanner';
import QwertyKeyboard from '../utils/qwerty-keyboard';
import MachineStateContext from '../utils/machine-state-context';
import {
    ScanPasswordLoginFirstSubheader,
    ScanPasswordLoginSecondSubheader,
    ScanPasswordLoginInputLabel,
    ScanPasswordLoginHeader,
    LoginLoginError
} from '../utils/formatted-messages';
import BarcodeHandler from '../utils/barcode-handler';
import { ACTION_RESET, BARCODE_SCANNING_TIMEOUT } from '../../constants';
import BarcodeScannerIcon from '../../../scss/images/barcode-scanner.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * ScanPasswordLogin.
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 *
 * @return {*}
 * @constructor
 */
function ScanPasswordLogin({ actionHandler }) {
    const context = useContext(MachineStateContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [subheader, setSubheader] = useState(ScanPasswordLoginFirstSubheader);
    const [usernameScanned, setUsernameScanned] = useState(false);

    /**
     * Setup barcode scanner.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(context.boxConfig.get.barcodeTimeout || BARCODE_SCANNING_TIMEOUT);
        const barcodeCallback = (new BarcodeHandler([
            ACTION_RESET
        ], actionHandler, function(result) {
            handleUsernameInput(result.outputCode);
        })).createCallback();

        barcodeScanner.start(barcodeCallback);
        return () => {
            barcodeScanner.stop();
        };
    }, [actionHandler]);

    /**
     * For setting the username
     *
     * @param username
     *   The username.
     */
    function handleUsernameInput(username) {
        setUsername(username);
        setUsernameScanned(true);
        setSubheader(ScanPasswordLoginSecondSubheader);
    }

    /**
     * Handles numpad  presses.
     *
     * @param key
     *   The pressed button.
     */
    function onInput(key) {
        if (key === '{enter}') {
            login();
        } else {
            key === '{bksp}'
                ? setPassword(password.slice(0, -1))
                : setPassword(`${password}${key}`);
        }
    }

    /**
     * Function to handle when keydown is enter.
     */
    function enterFunction(event) {
        if (event.key === 'Enter' && usernameScanned) {
            login();
        }
    }

    /**
     * Set up keydown listener.
     */
    useEffect(() => {
        window.addEventListener('keydown', enterFunction);
        return () => window.removeEventListener('keydown', enterFunction);
    }, [password]);

    /**
     * Handles keyboard inputs.
     *
     * @param target
     *    The pressed target.
     */
    function onKeyboardInput({ target }) {
        setPassword(target.value);
    }

    /**
     * Handles login
     */
    function login() {
        actionHandler('login', {
            username,
            password
        });
    }

    const loginError = context?.machineState?.get?.loginError;

    return (
        <>
            <Header
                header={ScanPasswordLoginHeader}
                subheader={subheader}
                type='login'
                icon={faSignInAlt}
            />
            <div className='col-md-3' />
            <div className='col-md-1'/>
            <div className='col-md-6'>
                {!usernameScanned && (
                    <div className='content'>
                        <img src={BarcodeScannerIcon} height={300} width={300}/>
                    </div>
                )}
                {usernameScanned && (
                    <>
                        <div className={'input' + (loginError ? ' error' : '')}>
                            <label htmlFor={'password'}>{ScanPasswordLoginInputLabel}</label>
                            <input name={'password'} id={'password'} type='password' value={password} onChange={onKeyboardInput} autoFocus />
                            {loginError &&
                            <div className='error-banner'>
                                <span className='info-banner-icon'>
                                    <FontAwesomeIcon icon={faExclamationTriangle} />
                                </span>
                                {LoginLoginError}
                            </div>
                            }
                        </div>
                    </>
                )}
            </div>
            <div className='col-md-5'>
                {usernameScanned && (context.boxConfig.get.debugEnabled || context.boxConfig.get.hasTouch) &&
                    <QwertyKeyboard handleKeyPress={onInput}/>
                }
            </div>
        </>
    );
}

ScanPasswordLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default ScanPasswordLogin;
