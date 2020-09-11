/**
 * @file
 *
 * For users that log in with keyboard
 */

import React, { useState } from 'react';
import Header from '../components/Header';
import Input from '../components/Input';
import HelpBox from '../components/HelpBox';
import NumPad from '../components/NumPad';
import Button from '../components/Button';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

/**
 * TypeLogin.
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler 
 *  calls the statemachine if a user requests a state change.
 *
 * @return {*}
 * @constructor
 */
function TypeLogin({ actionHandler }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameEntered, setUsernameEntered] = useState(false);

    /**
     * Handles key presses for username and password.
     *
     * @param key
     */
    function onNumPadPress({ key }) {
        if (!usernameEntered) {
            key.toLowerCase() === 'c'
                ? setUsername('')
                : setUsername(`${username}${key}`);
        } else {
            key.toLowerCase() === 'c'
                ? setPassword('')
                : setPassword(`${password}${key}`);
        }
    }

    /**
     * Handles button press for going from username to password,
     * and for password to actual login.
     */
    function onButtonPress() {
        if (!usernameEntered) {
            setUsernameEntered(true);
        } else {
            actionHandler('enterFlow', { flow: 'login' });
        }
    }

    return (
        <>
            <div className="col-md m-3">
            <Header
                    header="Login"
                    subheader="Indtast lånernummer"
                    which="login"
                    icon={faSignInAlt}
                />
                <div className="row">
                    <div className="col-md-2"/>
                    <div className="col-md mt-4">
                        {!usernameEntered && (
                            <Input
                                name="loanNumber"
                                label="Lånenummer"
                                value={username}
                                readOnly
                            />
                        )}
                        {usernameEntered && (
                            <Input
                                name="password"
                                label="Password"
                                value={password}
                                readOnly
                            />
                        )}
                        <NumPad handleNumpadPress={onNumPadPress}/>
                    </div>
                </div>
            </div>
            <div className="col-md-3 m-3 d-flex flex-column justify-content-between">
                <HelpBox
                    text={'Indtast dit lånernummer med knapperne her på skærmen.'}
                />
                <Button
                    label={'Fortsæt'}
                    icon={faArrowAltCircleRight}
                    handleButtonPress={onButtonPress}
                    which="login-button"
                />
            </div>
        </>
    );
}

TypeLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default TypeLogin;
