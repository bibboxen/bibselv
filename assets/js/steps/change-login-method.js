/**
 * @file
 * The initial page the user meets, from here they can go to other pages.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Bubble from './components/bubble';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { ChangeLoginMethodScanUsername, ChangeLoginMethodScanUsernameAndPassword } from './utils/formatted-messages';

/**
 * Initial component.
 *
 * Supplies a front page.
 *
 * @return {*}
 * @constructor
 */
function ChangeLoginMethod({ actionHandler }) {
    // @TODO: Add icon and labels.
    const components = [
        {
            type: 'loginScanUsername',
            label: ChangeLoginMethodScanUsername,
            icon: faBarcode
        },
        {
            type: 'loginScanUsernamePassword',
            label: ChangeLoginMethodScanUsernameAndPassword,
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
