/**
 * @file
 * The navbar is the navigation bar in the top.
 */

import React, { useContext } from 'react';
import Button from './button';
import MachineStateContext from '../utils/machine-state-context';
import {
    faInfoCircle,
    faPlayCircle,
    faStopCircle,
    faBug,
    faBirthdayCake,
    faSignOutAlt,
    faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    NavbarButtonCheckOut,
    NavbarButtonStatus,
    NavbarButtonCheckIn,
    NavbarButtonFinish,
    NavbarButtonLoginMethod,
    NavbarStopLoginSession,
    NavbarStartLoginSession
} from '../utils/formatted-messages';
import CheckInIconWhite from '../../../scss/images/check-in-white.svg';
import CheckOutIconBlack from '../../../scss/images/check-out-black.svg';
import { CONNECTION_OFFLINE, CONNECTION_ONLINE } from '../../constants';

/**
 * NavBar.
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function NavBar({ actionHandler }) {
    const context = useContext(MachineStateContext);
    const { step, activeLoginSession, user } = context.machineState.get;
    const { loginSessionEnabled, school, loginSessionMethods, debugEnabled } = context.boxConfig.get;
    const classes = step === 'initial' ? 'navbar initial' : 'navbar';
    const numberOfLoginSessionMethods = loginSessionMethods?.length;
    const components = [
        {
            class: 'button check-out-items',
            data: { flow: 'checkOutItems' },
            label: NavbarButtonCheckOut,
            img: CheckOutIconBlack
        },
        {
            class: context.connectionState.get === CONNECTION_ONLINE ? 'button status' : 'button offline',
            data: { flow: 'status' },
            disabled: context.connectionState.get === CONNECTION_OFFLINE,
            label: NavbarButtonStatus,
            icon: faInfoCircle
        },
        {
            class: 'button check-in-items',
            data: { flow: 'checkInItems' },
            label: NavbarButtonCheckIn,
            img: CheckInIconWhite
        }
    ];

    const showChangeLoginMethodButton = loginSessionEnabled && !activeLoginSession && user?.isAdmin && numberOfLoginSessionMethods > 1 && step !== 'changeLoginMethod';
    const showStartLoginSessionButton = (step === 'status' || step === 'checkOutItems') && numberOfLoginSessionMethods === 1 && !activeLoginSession;

    /**
     * Enter change login flow.
     */
    function changeLoginMethod() {
        actionHandler('changeFlow', {
            flow: 'changeLoginMethod'
        });
    }

    /**
     * Stop login session.
     */
    function stopLoginSession() {
        actionHandler('stopLoginSession');
    }

    /**
     * Stop login session.
     */
    function startLoginSession() {
        actionHandler('startLoginSession');
    }

    return (
        <div className={classes} >
            <div className='text-container'>
                <span className='text'>{school.name}</span>
                {user && (
                    <span className='text bold'>
                        {user.name}
                    </span>
                )}
                {user?.birthdayToday && (
                    <span className='birthday-icon'>
                        <FontAwesomeIcon icon={faBirthdayCake}/>
                    </span>
                )}
                {debugEnabled && (
                    <span className='text bold'>
                        Debug mode!
                        <FontAwesomeIcon icon={faBug} style={{ paddingLeft: '4px', color: 'hotpink' }}/>
                    </span>
                )}
            </div>
            <div className='button-container'>
                {showChangeLoginMethodButton &&
                <Button
                    label={NavbarButtonLoginMethod}
                    icon={faExchangeAlt}
                    onClick={changeLoginMethod}
                    className='button login-method'
                />
                }
                {showStartLoginSessionButton &&
                <Button
                    onClick={startLoginSession}
                    icon={faPlayCircle}
                    label={NavbarStartLoginSession}
                    className='button start-session'
                />
                }
                {activeLoginSession &&
                <Button
                    onClick={stopLoginSession}
                    icon={faStopCircle}
                    label={NavbarStopLoginSession}
                    className='button stop-session'
                />
                }
                {step !== 'initial' &&
                    <>
                        {['status', 'checkInItems', 'checkOutItems'].includes(step) &&
                            components.map((button) => (
                                <Button
                                    key={button.class}
                                    label={button.label}
                                    icon={button.icon}
                                    disabled={button.disabled}
                                    onClick={() => actionHandler('changeFlow', button.data)}
                                    className={button.class}
                                    img={button.img}
                                />
                            ))
                        }
                        <Button
                            label={NavbarButtonFinish}
                            icon={faSignOutAlt}
                            onClick={() => actionHandler('reset')}
                            className='button logout'
                        />
                    </>
                }
            </div>
        </div>
    );
}

NavBar.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default NavBar;
