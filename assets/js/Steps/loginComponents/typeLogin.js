/**
 * @file
 *
 * @TODO: Describe what it is used for.
 */

import React, { useState } from 'react';
import Header from '../components/header';
import Input from '../components/input';
import HelpBox from '../components/helpBox';
import NumPad from '../components/numPad';
import Button from '../components/button';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';

/**
 * TypeLogin.
 *
 * @param actionHandler
 *   @TODO: Describe prop.
 *
 * @return {*}
 * @constructor
 */
function TypeLogin({ actionHandler }) {
    // @TODO: Rename loadNumber to username
    const [loanNumber, setLoanNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loanNumberEntering, setLoanNumberEntering] = useState(true);

    /**
     * @TODO: Document function.
     *
     * @param button
     */
    function onNumPadPress({ button }) {
        if (loanNumberEntering) {
            button.toLowerCase() === 'c'
                ? setLoanNumber('')
                : setLoanNumber(`${loanNumber}${button}`);
        } else {
            button.toLowerCase() === 'c'
                ? setPassword('')
                : setPassword(`${password}${button}`);
        }
    }

    /**
     * @TODO: Document function.
     */
    function onButtonPress() {
        if (loanNumberEntering) {
            setLoanNumberEntering(false);
        } else {
            actionHandler('enterFlow', { flow: 'login' });
        }
    }

    return (
        <>
            <div className="col-md m-3">
                <Header header="Login" text="Indtast lånernummer"/>
                <div className="row">
                    <div className="col-md-2"/>
                    <div className="col-md mt-4">
                        {loanNumberEntering && (
                            <Input
                                name="loanNumber"
                                label="Lånenummer"
                                value={loanNumber}
                                readOnly
                            />
                        )}
                        {!loanNumberEntering && (
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
