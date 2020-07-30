import React, { useContext } from 'react';
import MachineStateContext from '../../context/machineStateContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBookReader,
    faInfoCircle,
    faBook,
    faSignInAlt
} from '@fortawesome/free-solid-svg-icons';

function IconBubble() {
    const context = useContext(MachineStateContext);
    function renderStep(step) {
        if (context.loggedIn.get) {
            switch (step) {
            case 'borrow':
                return (
                    <div className="header-icon borrow">
                        <div className="icon">
                            <FontAwesomeIcon icon={faBookReader} />
                        </div>
                    </div>
                );
            case 'handin':
                return (
                    <div className="header-icon handin">
                        <div className="icon">
                            <FontAwesomeIcon icon={faBook} />
                        </div>
                    </div>
                );
            case 'status':
                return (
                    <div className="header-icon status">
                        <div className="icon">
                            <FontAwesomeIcon icon={faInfoCircle} />
                        </div>
                    </div>
                );
            }
        } else {
            return (
                <div className="header-icon login">
                    <div className="icon">
                        <FontAwesomeIcon icon={faSignInAlt} />
                    </div>
                </div>
            );
        }
    }

    return <div className="col-md-2">{renderStep(context.step.get)}</div>;
}

export default IconBubble;
