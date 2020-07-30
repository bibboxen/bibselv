import React, { useContext, useState } from 'react';
import MachineStateContext from '../../context/machineStateContext';
import Header from '../components/header';
import Input from '../components/input';
import HelpBox from '../components/helpBox';
import NumPad from '../components/numPad';
import Button from '../components/button';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';

function TypeLogin({ actionHandler }) {
    const [loanNumber, setLoanNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loanNumberEntering, setLoanNumberEntering] = useState(true);
    const context = useContext(MachineStateContext);
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
    function onButtonPress() {
        if (loanNumberEntering) {
            setLoanNumberEntering(false);
        } else {
            actionHandler('login', context);
        }
    }
    return (
        <>
            <div className="col-md m-3">
                <Header header="Login" text="Indtast lånernummer"></Header>
                <div className="row">
                    <div className="col-md-2"></div>

                    <div className="col-md mt-4">
                        {loanNumberEntering && (
                            <Input
                                name="loanNumber"
                                label="Lånenummer"
                                value={loanNumber}
                                readOnly
                            ></Input>
                        )}
                        {!loanNumberEntering && (
                            <Input
                                name="password"
                                label="Password"
                                value={password}
                                readOnly
                            ></Input>
                        )}
                        <NumPad handleNumpadPress={onNumPadPress}></NumPad>
                    </div>
                </div>
            </div>
            <div className="col-md-3 m-3 d-flex flex-column justify-content-between">
                <HelpBox
                    text={'Indtast dit lånernummer med knapperne her på skærmen.'}
                ></HelpBox>
                <Button
                    label={'Fortsæt'}
                    icon={faArrowAltCircleRight}
                    handleButtonPress={onButtonPress}
                    color="green"
                ></Button>
            </div>
        </>
    );
}
TypeLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default TypeLogin;
