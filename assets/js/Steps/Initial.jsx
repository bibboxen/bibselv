import React from 'react';
import {
    faBookReader,
    faInfoCircle,
    faBook
} from '@fortawesome/free-solid-svg-icons';

import Bubble from './components/bubble';
import Barcode from './components/barcode';
import PropTypes from 'prop-types';

function Initial({ actionHandler }) {
    const components = [
        {
            which: 'borrow',
            type: 'borrow',
            label: 'Lån',
            icon: faBookReader
        },
        {
            which: 'status',
            type: 'status',
            label: 'Status',
            icon: faInfoCircle
        },
        { which: 'handin', type: 'handin', label: 'Aflever', icon: faBook }
    ];

    return (
        <div className="col-md-12">
            <h1 className="mb-5">Vælg en funktion for at starte</h1>
            <div className="row justify-content-center">
                {components.map((component) => (
                    <div key={component.which} className="col-md-3">
                        <Bubble
                            which={component.which}
                            label={component.label}
                            icon={component.icon}
                            actionHandler={actionHandler}
                        />
                    </div>
                ))}
            </div>
            <div className="row justify-content-center mt-5">
                {components.map((component) => (
                    <div className="col-md-3" key={component.which} >
                        <Barcode key={component.color} which={component.which} />
                    </div>
                ))}
            </div>
        </div>
    );
}
Initial.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default Initial;
