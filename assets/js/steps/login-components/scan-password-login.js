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
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_COMMAND_LENGTH
} from '../../constants';
import MachineStateContext from '../../context/machine-state-context';
import { FormattedMessage } from 'react-intl';

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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [subheader, setSubheader] = useState('Scan dit bibliotekskort');
    const [helpboxText, setHelpboxText] = useState(
        <FormattedMessage id='scan-login-password-usename-help-box-text' defaultMessage='Brug håndscanneren til at scanne stregkoden din lånerkort.' />
    );
    const inputLabel = <FormattedMessage id='scan-login-password-input-label' defaultMessage='Password' />;
    const [usernameScanned, setUsernameScanned] = useState(false);
    const context = useContext(MachineStateContext);
    const loginButtonLabel = 'Login';
    const deleteButtonLabel = 'Slet';
    /**
     * Setup component.
     *
     * Starts barcode scanner listener.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);

        const barcodeCallback = (code) => {
            if (code.length === BARCODE_COMMAND_LENGTH) {
                if (code === BARCODE_COMMAND_FINISH) {
                    actionHandler('reset');
                }
            } else {
                handleUsernameInput(code);
                setUsername(code);
                setUsernameScanned(true);
                setHelpboxText(<FormattedMessage id='scan-login-password-password-help-box-text' defaultMessage='Har du glemt din pinkode kan du kontakte en bibliotekar for at få lavet en ny' />);
                setSubheader('Tast dit password');
            }
        };

        barcodeScanner.start(barcodeCallback);

        // Stop scanning when component is unmounted.
        return () => barcodeScanner.stop();
    }, [actionHandler]);

    /**
       * For setting the username
       *
       * @param key
       *   The username.
       */
    function handleUsernameInput(username) {
        setUsername(username);
        setUsernameScanned(true);
        setHelpboxText(<FormattedMessage id='scan-login-password-password-help-box-text' defaultMessage='Har du glemt din pinkode kan du kontakte en bibliotekar for at få lavet en ny' />);
        setSubheader(<FormattedMessage id='scan-login-password-password-subheader' defaultMessage='Tast din pinkode' />);
    }

    /**
       * Handles numpad  presses.
       *
       * @param key
       *   The pressed button.
       */
    function onNumPadPress(key) {
        if (!usernameScanned) {
            key === deleteButtonLabel
                ? setUsername('')
                : setUsername(`${username}${key}`);
        } else {
            if (key === loginButtonLabel) {
                actionHandler('login', {
                    username: username,
                    password: password
                });
            } else {
                key === deleteButtonLabel
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
                    <div className='col-md-2' />
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
                                    label={inputLabel}
                                    value={password}
                                    type="password"
                                    onChange={onKeyboardInput}
                                />
                                <NumPad okButtonLabel={loginButtonLabel}
                                    deleteButtonLabel={deleteButtonLabel}
                                    handleNumpadPress={onNumPadPress} />
                            </>)}
                            <Input
                                name='password'
                                label={inputLabel}
                                value={password}
                                readOnly
                            />
                        )}
                        {usernameScanned && (
                            <NumPad handleNumpadPress={onNumPadPress} />
                        )}
                    </div>
                </div>
            </div>
            <div className='col-md-3 m-3 d-flex flex-column justify-content-between'>
                {!usernameScanned && <HelpBox text={helpboxText} />}
                {context.boxConfig.get.debugEnabled && (
                    <Button
                        label={'Snydelogin'}
                        icon={faArrowAltCircleRight}
                        handleButtonPress={() =>
                            actionHandler('login', {
                                username: 'C023648674',
                                password: ''
                            })}
                        which='login-button'
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
