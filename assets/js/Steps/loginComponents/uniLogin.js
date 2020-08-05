import React, { useContext } from 'react';
import MachineStateContext from '../../context/machineStateContext';
import HelpBox from '../components/helpBox';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
function UniLogin({ actionHandler }) {
    const context = useContext(MachineStateContext);
    return (
        <>
            <div className="col-md-9">
                <Header header="Login" text="Login med Unilogin"></Header>
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md mt-4">

                        <div
                            className="content"
                            onClick={() => actionHandler('login', context)}
                        >
                            <FontAwesomeIcon icon={faSchool} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <HelpBox
                    text={
                        'Du logger ind med dit Unilogin ved først at skrive dit brugernavn, trykker næste og derefter indtaster dit password i det nye felt på skærmen.'
                    }
                ></HelpBox>
            </div>
        </>
    );
}

UniLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default UniLogin;
