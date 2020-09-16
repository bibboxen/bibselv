/**
 * @file
 *
 * For users that log in with Unilogin
 */

import React, { useContext } from 'react';
import MachineStateContext from '../../context/machineStateContext';
import HelpBox from '../components/HelpBox';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

/**
 * UniLogin.
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler 
 *  calls the statemachine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function UniLogin({ actionHandler }) {
    const context = useContext(MachineStateContext);
    return (
        <>
            <div className='col-md-9'>
            <Header
                    header='Login'
                    subheader='Login med Unilogin'
                    which='login'
                    icon={faSignInAlt}
                />
                <div className='row'>
                    <div className='col-md-2'/>
                    <div className='col-md mt-4'>
                        <div className='content' onClick={() => actionHandler('login', context)}>
                            <FontAwesomeIcon icon={faSchool}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-3'>
                <HelpBox
                    text={
                        'Du logger ind med dit Unilogin ved først at skrive dit brugernavn, trykker næste og derefter indtaster dit password i det nye felt på skærmen.'
                    }
                />
            </div>
        </>
    );
}

UniLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default UniLogin;
