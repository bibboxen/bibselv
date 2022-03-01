/**
 * @file
 * Component for starting a login session.
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Bubble from './components/bubble';
import HelpBox from './components/help-box';
import { faBarcode, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import {
    ChangeLoginMethodScanUsername,
    ChangeLoginMethodScanUsernameAndPassword,
    ChangeLoginMethodPickLoginMethodHeader,
    ChangeLoginMethodPickLoginMethodSubheader,
    ChangeLoginMethodTimeoutMessage
} from './utils/formatted-messages';
import MachineStateContext from './utils/machine-state-context';
import Header from './components/header';

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
    const { loginSessionMethods, loginSessionTimeout } = context.boxConfig.get;
    const components = [];

    if (loginSessionMethods.includes('login_barcode_password')) {
        components.push({
            type: 'loginScanUsernamePassword',
            label: ChangeLoginMethodScanUsernameAndPassword,
            icon: faLock
        });
    }

    if (loginSessionMethods.includes('login_barcode')) {
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
        <>
            <Header
                header={ChangeLoginMethodPickLoginMethodHeader}
                subheader={ChangeLoginMethodPickLoginMethodSubheader}
                type='login'
                icon={faSignInAlt}
            />
            <div className='col-md-3'>
                <HelpBox text={ChangeLoginMethodTimeoutMessage(loginSessionTimeout)} />
            </div>
            <div className="col-md-1" />
            <div className='col-md-12'>
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
        </>
    );
}

ChangeLoginMethod.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default ChangeLoginMethod;
