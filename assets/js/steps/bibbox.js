/**
 * @file
 * Contains main logic for loading steps.
 */

import React, { useEffect } from 'react';
import Initial from './initial';
import Login from './login';
import Status from './status';
import CheckInItems from './check-in-items';
import NavBar from './components/navbar';
import CheckOutItems from './check-out-items';
import PropTypes from 'prop-types';
import MachineStateContext from './utils/machine-state-context';
import { Sound } from './utils/sound';

/**
 * Bibbox app.
 *
 * @param boxConfigurationInput
 *   The configuration of the bibbox.
 * @param machineStateInput
 *   The state of the app.
 * @param actionHandler
 *   Callback on requested state change.
 * @param connectionState
 *   Connection state.
 *
 * @return {*}
 * @constructor
 */
function Bibbox({ boxConfigurationInput, machineStateInput, actionHandler, connectionState }) {
    const sound = new Sound();
    const { user } = machineStateInput;

    /**
     * The storage contains the machine state.
     * The step of the machine state determines which component is rendered, and
     * can only be changed by the state machine.
     */
    const storage = {
        machineState: { get: machineStateInput },
        boxConfig: { get: boxConfigurationInput },
        connectionState: { get: connectionState }
    };

    /**
     * Play birthday music if user has birthday.
     */
    useEffect(() => {
        if (user === undefined || !boxConfigurationInput.soundEnabled) return;

        // @TODO: Add configuration option to disable birthday sound.
        const lastPlayed = window.localStorage.getItem(user.id);
        const lastPlayedDate = lastPlayed ? new Date(parseInt(lastPlayed)) : undefined;
        const today = new Date();
        if (user.birthdayToday && lastPlayedDate?.getFullYear() !== today.getFullYear()) {
            window.localStorage.setItem(user.id, Date.now());
            sound.playSound('birthday');
        }
    }, [user]);

    /**
     * renderStep determines which component to render based on the step
     * returned from the state machine.
     *
     * @param step
     *   The step from the machine state
     * @return component to be rendered
     */
    function renderStep(step) {
        switch (step.toLowerCase()) {
            case 'checkoutitems':
                return <CheckOutItems actionHandler={actionHandler} />;
            case 'checkinitems':
                return <CheckInItems actionHandler={actionHandler} />;
            case 'status':
                return <Status actionHandler={actionHandler} />;
            case 'loginscan':
                return <Login actionHandler={actionHandler} />;
            case 'initial':
                return <Initial actionHandler={actionHandler} />;
            default:
                return <Initial actionHandler={actionHandler} />;
        }
    }

    return (
        <MachineStateContext.Provider value={storage}>
            <NavBar actionHandler={actionHandler} />
            <div className='container'>
                <div className='row' style={{ width: '100%' }}>
                    {renderStep(machineStateInput.step)}
                </div>
            </div>
        </MachineStateContext.Provider>
    );
}

Bibbox.propTypes = {
    boxConfigurationInput: PropTypes.object.isRequired,
    machineStateInput: PropTypes.object.isRequired,
    connectionState: PropTypes.object.isRequired,
    actionHandler: PropTypes.func.isRequired
};

export default Bibbox;
