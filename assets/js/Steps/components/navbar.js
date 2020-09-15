/**
 * @file
 *
 * The navbar is the navigation bar in the top. 
 */

import React, { useContext } from 'react';
import MachineStateContext from '../../context/machineStateContext';
import Button from './Button';
import {
    faBookReader,
    faInfoCircle,
    faBook,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

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
    const classes = context.machineState.get.step === 'initial'
        ? 'navbar initial' : 'navbar';
    const components = [
        {
            which: 'checkOutItems',
            label: 'Lån',
            icon: faBookReader
        },
        {
            which: 'status',
            label: 'Status',
            icon: faInfoCircle
        },
        {
            which: 'checkInItems',
            label: 'Aflever',
            icon: faBook
        }
    ];

    /**
     * When a button is pressed, this function is called and it request a state change.
     *
     * @param which
     *   which determines which flow to request.
     */
    function onButtonPress(which) {
        actionHandler('changeFlow', { flow: which });
    }

    return (
        <div className={classes}>
            <div className='text-container'>
                <span className='text'>{context.boxConfig.get.school.name}</span>
                {context.machineState.get.user && (
                    <span className='text bold'>
                        {context.machineState.get.user.name}
                    </span>
                )}
            </div>
            <div className='button-container'>
                {context.machineState.get.user &&
                components.map((button) => (
                    <Button
                        key={button.which}
                        label={button.label}
                        icon={button.icon}
                        handleButtonPress={onButtonPress}
                        which={button.which}
                    />
                ))}
                {context.machineState.get.step !== 'initial' &&
                    <Button
                        label='Afslut'
                        icon={faSignOutAlt}
                        handleButtonPress={onButtonPress}
                        which={'reset'}
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
