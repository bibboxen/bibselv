/**
 * @file
 * The initial page the user meets, from here they can go to other pages.
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Bubble from './components/bubble';
import {faBarcode, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import MachineStateContext from './utils/machine-state-context';

/**
 * Initial component.
 *
 * Supplies a front page.
 *
 * @return {*}
 * @constructor
 */
function ChangeLoginMethod({ actionHandler }) {
    const context = useContext(MachineStateContext);

    // @TODO: Add icon and labels.
    const components = [
        {
            type: 'loginScanUsername',
            label: 'Skan brugernavn',
            icon: faBarcode
        },
        {
            type: 'loginScanUsernamePassword',
            label: 'Skan brugernavn og kodeord',
            icon: faBarcode
        }
    ];

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
                {'@TODO: Skriv hvilke options der er valgt'}
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
                              handleChangeLoginMethod(component.type)
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
