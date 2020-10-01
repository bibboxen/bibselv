/**
 * @file
 * The navbar is the navigation bar in the top.
 */

import React, { useContext } from 'react';
import MachineStateContext from '../../context/machine-state-context';
import Button from './button';
import {
    faBookReader,
    faInfoCircle,
    faBook,
    faSignOutAlt,
    faBug,
    faPrint,
    faBirthdayCake
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';

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
    const classes = context.machineState.get.step === 'initial' ? 'navbar initial' : 'navbar';
    const buttonCheckOut = <FormattedMessage id='button-navbar-check-out' defaultMessage='Loan' />;
    const buttonStatus = <FormattedMessage id='button-navbar-status' defaultMessage='Status' />;
    const buttonCheckIn = <FormattedMessage id='button-navbar-check-in' defaultMessage='Hand in' />;
    const buttonFinish = <FormattedMessage id='button-navbar-finish' defaultMessage='Exit' />;
    const components = [
        {
            color: 'yellow',
            data: { flow: 'checkOutItems' },
            label: buttonCheckOut,
            icon: faBookReader
        },
        {
            color: 'blue',
            data: { flow: 'status' },
            label: buttonStatus,
            icon: faInfoCircle
        },
        {
            color: 'purple',
            data: { flow: 'checkInItems' },
            label: buttonCheckIn,
            icon: faBook
        }
    ];

    /**
     * Prints the page, available in status component.
     */
    function printPage() {
        window.print();
    }

    return (
        <div className={classes} >
            <div className='text-container'>
                <span className='text'>{context.boxConfig.get.school.name}</span>
                {context.machineState.get.user && (
                    <span className='text bold'>
                        {context.machineState.get.user.name}
                    </span>
                )}
                {context.machineState.get.user && context.machineState.get.user.birthdayToday && (
                    <span className='birthday-icon'>
                        <FontAwesomeIcon icon={faBirthdayCake}></FontAwesomeIcon>
                    </span>
                )}
                {context.boxConfig.get.debugEnabled && (
                    <span className='text bold'>
                        Debug mode!
                        <FontAwesomeIcon icon={faBug} style={{ paddingLeft: '4px', color: 'hotpink' }}></FontAwesomeIcon>
                    </span>
                )}
            </div>
            <div className='button-container'>
                {context.machineState.get.step === 'status' &&
                    <Button
                        label='Print'
                        icon={faPrint}
                        handleButtonPress={() => printPage()}
                        color='green'
                    />
                }
                {context.machineState.get.user &&
                components.map((button) => (
                    <Button
                        key={button.color}
                        label={button.label}
                        icon={button.icon}
                        handleButtonPress={() => actionHandler('changeFlow', button.data)}
                        color={button.color}
                    />
                ))}
                {context.machineState.get.step !== 'initial' &&
                    <Button
                        label={buttonFinish}
                        icon={faSignOutAlt}
                        handleButtonPress={() => actionHandler('reset')}
                        color='red'
                    />
                }
            </div>
        </div>
    );
}

NavBar.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default NavBar;
