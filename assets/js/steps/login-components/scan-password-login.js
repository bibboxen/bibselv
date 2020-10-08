/**
 * @file
 * For users that scans username and types password to login.
 */

import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/header';
import Input from '../components/input';
import HelpBox from '../components/help-box';
import Button from '../components/button';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import BarcodeScanner from '../utils/barcode-scanner';
import QwertyKeyboard from '../utils/qwerty-keyboard';
import MachineStateContext from '../utils/machine-state-context';
import {
    ScanPasswordLoginFirstSubheader,
    ScanPasswordLoginSecondSubheader,
    ScanPasswordLoginFirstHelpboxText,
    ScanPasswordLoginInputLabel,
    ScanPasswordLoginSecondHelpboxText,
    ScanPasswordLoginHeader
} from '../utils/formattedMessages';
import BarcodeHandler from '../utils/barcode-handler';
import { ACTION_RESET } from '../../constants';
import BarcodeScannerIcon from '../../../scss/images/barcode-scanner.svg';

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
    const [helpboxText, setHelpboxText] = useState(ScanPasswordLoginFirstHelpboxText);
    const [usernameScanned, setUsernameScanned] = useState(false);

    /**
     * Setup barcode scanner.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner();
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
        setHelpboxText(ScanPasswordLoginSecondHelpboxText);
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
     *
     * @param target
     *    The pressed target.
     */
    function login() {
        actionHandler('login', {
            username: username,
            password: password
        });
    }

    return (
        <>
            <Header
                header={ScanPasswordLoginHeader}
                subheader={subheader}
                type='login'
                icon={faSignInAlt}
            />
            <div className='col-md-3'>
                {!usernameScanned && <HelpBox text={helpboxText}/>}
            </div>
            <div className='col-md-1'/>
            <div className='col-md-6'>
                {!usernameScanned && (
                    <div className='content'>
                        <img src={BarcodeScannerIcon} height={300} width={300}/>
                    </div>
                )}
                {usernameScanned && (
                    <Input
                        name='password'
                        label={ScanPasswordLoginInputLabel}
                        value={password}
                        onChange={onKeyboardInput}
                        type='password'
                    />
                )}
            </div>
            <div className='col-md-5'>
                {usernameScanned && (context.boxConfig.get.debugEnabled || context.boxConfig.get.hasTouch) &&
                <QwertyKeyboard handleKeyPress={onInput}/>
                }
            </div>
            {context.boxConfig.get.debugEnabled && (
                <div className='col-md'>
                    <Button
                        label={'indtast brugernavn'}
                        icon={faArrowAltCircleRight}
                        handleButtonPress={() => handleUsernameInput('C023648674')}/>
                    <Button
                        label={'Snydelogin'}
                        icon={faArrowAltCircleRight}
                        handleButtonPress={() =>
                            actionHandler('login', {
                                username: 'C023648674',
                                useDefaultPassword: true
                            })}
                    />
                </div>
            )}
        </>
    );
}

ScanPasswordLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default ScanPasswordLogin;
