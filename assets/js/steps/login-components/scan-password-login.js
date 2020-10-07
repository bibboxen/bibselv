/**
 * @file
 * For users that scans username and types password to login.
 */

import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/header';
import Input from '../components/input';
import HelpBox from '../components/help-box';
import NumPad from '../utils/num-pad';
import Button from '../components/button';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';
import { faSignInAlt, faBarcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BarcodeScanner from '../utils/barcode-scanner';
import MachineStateContext from '../../context/machine-state-context';
import {
    ScanPasswordLoginFirstSubheader,
    ScanPasswordLoginSecondSubheader,
    ScanPasswordLoginFirstHelpboxText,
    ScanPasswordLoginInputLabel,
    ScanPasswordLoginSecondHelpboxText,
    ScanPasswordLoginLoginButton,
    ScanPasswordLoginDeleteButton
} from '../utils/formattedMessages';
import BarcodeHandler from '../utils/barcode-handler';
import { ACTION_RESET } from '../../constants';

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
    function onNumPadPress(key) {
        if (!usernameScanned) {
            key === ScanPasswordLoginDeleteButton
                ? setUsername('')
                : setUsername(`${username}${key}`);
        } else {
            if (key === ScanPasswordLoginLoginButton) {
                actionHandler('login', {
                    username: username,
                    password: password
                });
            } else {
                key === ScanPasswordLoginDeleteButton
                    ? setPassword(password.slice(0, -1))
                    : setPassword(`${password}${key}`);
            }
        }
    }

    /**
     * Handles keyboard inputs.
     *
     * @param target
     *    The pressed target.
     */
    function onKeyboardInput({ target }) {
        setPassword(target.value);
    }

    return (
        <>
            <div className='col-md m-3'>
                <Header
                    header='Login'
                    subheader={subheader}
                    which='login'
                    icon={faSignInAlt}
                />
                <div className='row'>
                    <div className='col-md-2'/>
                    <div className='col-md mt-4'>
                        {!usernameScanned && (
                            // Todo Remember to remove thisss
                            <div className='content' onClick={() => handleUsernameInput('C023648674')}>
                                <FontAwesomeIcon icon={faBarcode}/>
                            </div>
                        )}
                        {usernameScanned && (
                            <>
                                <Input
                                    name='password'
                                    label={ScanPasswordLoginInputLabel}
                                    value={password}
                                    type="password"
                                    onChange={onKeyboardInput}
                                />
                                <NumPad okButtonLabel={ScanPasswordLoginLoginButton}
                                    ScanPasswordLoginDeleteButton={ScanPasswordLoginDeleteButton}
                                    handleNumpadPress={onNumPadPress}/>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className='col-md-3 m-3 d-flex flex-column justify-content-between'>
                {!usernameScanned && <HelpBox text={helpboxText}/>}
                {context.boxConfig.get.debugEnabled && (
                    <Button
                        label={'Snydelogin'}
                        icon={faArrowAltCircleRight}
                        handleButtonPress={() =>
                            actionHandler('login', {
                                username: 'C023648674',
                                password: ''
                            })}
                    />
                )}
            </div>
        </>
    );
}

ScanPasswordLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default ScanPasswordLogin;
