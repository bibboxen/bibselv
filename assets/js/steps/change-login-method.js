/**
 * @file
 * Component for starting a login session.
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Bubble from './components/bubble';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { ChangeLoginMethodScanUsername, ChangeLoginMethodScanUsernameAndPassword } from './utils/formatted-messages';
import MachineStateContext from './utils/machine-state-context';

/**
 * Change login method.
 *
 * Component for starting a login session.
 *
 * @return {*}
 * @constructor
 */
function ChangeLoginMethod({ actionHandler }) {
    const context = useContext(MachineStateContext);
    const boxConfig = context.boxConfig;

    const components = [];

    if (boxConfig?.get?.loginSessionMethods?.includes('login_barcode_password')) {
        components.push({
            type: 'loginScanUsernamePassword',
            label: ChangeLoginMethodScanUsernameAndPassword,
            icon: faBarcode
        });
    }

    if (boxConfig?.get?.loginSessionMethods?.includes('login_barcode')) {
        components.push({
            type: 'loginScanUsername',
            label: ChangeLoginMethodScanUsername,
            icon: faBarcode
        });
    }

    /**
     * Handle scanned items.
     *
     * @param loginMethod
     */
    function handleChangeLoginMethod(loginMethod) {
        actionHandler('selectLoginMethod', {
            loginMethod: loginMethod
        });
    }

    return (
        <div className='col-md-12'>
            <h1 className='mb-5'>
                {'Vælg login metode'}
            </h1>
            <div>
                { /* @TODO: Fix translation and styling */ }
                <span>Timeout: </span> {boxConfig?.get?.loginSessionTimeout} s.
                Efter denne periode stopper login sessionen.
            </div>
            <div className='row justify-content-center'>
                {components.map((component) => (
                    <div key={component.type} className='col-md-3'>
                        <Bubble
                            type={component.type}
                            label={component.label}
                            icon={component.icon}
                            img={component.img}
                            disabled={component.disabled}
                            onClick={() => {
                                handleChangeLoginMethod(component.type);
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

ChangeLoginMethod.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default ChangeLoginMethod;
