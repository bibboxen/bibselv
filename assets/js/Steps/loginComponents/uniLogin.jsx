import React, {useContext} from 'react';
import MachineStateContext from '../../context/machineStateContext';
import HelpBox from '../components/helpBox';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
function UniLogin({actionHandler}) {
    const context = useContext(MachineStateContext);

    return (
        <>
            <div className="flex-container-row">
                <div className="flex-container">
                    <Header header="Login" text="Login med Unilogin"></Header>
                    <div className="content" onClick={() => actionHandler("login",context)}>
                        <FontAwesomeIcon icon={faSchool} />
                    </div>
                </div>
                <div className="flex-container">
                    <HelpBox
                        text={
                            'Du logger ind med dit Unilogin ved først at skrive dit brugernavn, trykker næste og derefter indtaster dit password i det nye felt på skærmen.'
                        }
                    ></HelpBox>
                </div>
            </div>
        </>
    );
}

UniLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default UniLogin;
