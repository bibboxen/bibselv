/**
 * @file
 * Contains main logic for loading steps.
 */

import React, { useEffect } from 'react';
import Initial from './initial';
import Status from './status';
import CheckInItems from './check-in-items';
import NavBar from './components/navbar';
import CheckOutItems from './check-out-items';
import PropTypes from 'prop-types';
import MachineStateContext from './utils/machine-state-context';
import { Sound } from './utils/sound';
import ChangeLoginMethod from './change-login-method';
import ScanLogin from './login-components/scan-login';
import ScanPasswordLogin from './login-components/scan-password-login';

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
        switch (step) {
            case 'checkOutItems':
                return <CheckOutItems actionHandler={actionHandler} />;
            case 'checkInItems':
                return <CheckInItems actionHandler={actionHandler} />;
            case 'status':
                return <Status actionHandler={actionHandler} />;
            case 'initial':
                return <Initial actionHandler={actionHandler} />;
            case 'changeLoginMethod':
                return <ChangeLoginMethod actionHandler={actionHandler} />;
            case 'loginScanUsername':
                return <ScanLogin actionHandler={actionHandler} />;
            case 'loginScanUsernamePassword':
                return <ScanPasswordLogin actionHandler={actionHandler} />;
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
    connectionState: PropTypes.string.isRequired,
    actionHandler: PropTypes.func.isRequired
};

export default Bibbox;
