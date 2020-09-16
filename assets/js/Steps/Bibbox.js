/**
 * @file
 * The main entrypoint of the react application.
 */

import React from 'react';
import Initial from './Initial';
import Login from './Login';
import Status from './Status';
import CheckInItems from './CheckInItems';
import NavBar from './components/Navbar';
import CheckOutItems from './CheckOutItems';
import PropTypes from 'prop-types';
import MachineStateContext from '../context/machineStateContext';

/**
 * App. The main entrypoint of the react application.
 *
 * @param boxConfigurationInput
 *   The configuration of the bibbox.
 * 
 * @param machineStateInput
 *   The state of the app.
 * 
 * @param actionHandler
 *   Callback on requested state change.
 * @return {*}
 * @constructor
 */
function Bibbox({ boxConfigurationInput, machineStateInput, actionHandler }) {
    /**
     *
     * The storage contains the machinestate, which is the state of the app.
     * The state of the app determines the which component is rendered, and
     * can only be changed by the state machine.
     * The library is the name of the library the machine is installed on.
     *
     */
    const storage = {
        machineState: { get: machineStateInput },
        boxConfig: { get: boxConfigurationInput },
    };

    /**
     * renderStep determines which component to render based on the step
     * returned from the state machine.
     *
     * @param step
     *   The step from the machinestate
     * @return component to be rendered
     */
    function renderStep(step) {
        debugger
        switch (step.toLowerCase()) {
            case 'checkoutitems':
                return <CheckOutItems actionHandler={actionHandler} />;
            case 'checkinitems':
                return <CheckInItems actionHandler={actionHandler} />;
            case 'status':
                return <Status actionHandler={actionHandler} />;
            case 'scanlogin':
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
    actionHandler: PropTypes.func.isRequired,
};

export default Bibbox;
