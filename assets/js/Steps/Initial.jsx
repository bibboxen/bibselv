import React from 'react';
import {
    faBookReader,
    faInfoCircle,
    faBook
} from '@fortawesome/free-solid-svg-icons';

import Bubble from './components/bubble';
import Barcode from './components/barcode';
import PropTypes from 'prop-types';

function Initial({actionHandler}) {
    const components = [
        {
            which: 'borrow',
            color: 'yellow',
            label: 'Lån',
            icon: faBookReader
        },
        {
            which: 'status',
            color: 'blue',
            label: 'Status',
            icon: faInfoCircle
        },
        { which: 'handin', color: 'purple', label: 'Aflever', icon: faBook }
    ];

    return (
        <>
            <h1>Vælg en funktion for at starte</h1>
            <div className="initial-container">
                {components.map((component) => (
                    <Bubble
                        key={component.which}
                        which={component.which}
                        color={component.color}
                        label={component.label}
                        icon={component.icon}
                        actionHandler={actionHandler} 
                    />
                ))}
            </div>
            <div className="initial-container">
                {components.map((component) => (
                    <Barcode key={component.color} color={component.color} />
                ))}
            </div>
        </>
    );
}
Initial.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default Initial;
