import React, { useContext } from 'react';
import MachineStateContext from '../../context/machineStateContext';
import Button from '../components/button';
import {
    faBookReader,
    faInfoCircle,
    faBook,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
function NavBar() {
    const context = useContext(MachineStateContext);
    const classes = context.step.get === 'initial' ? 'navbar initial' : 'navbar';
    function login() {
        if (context.loggedIn.get) {
            context.username.set();
            context.loggedIn.set(false);
        } else {
            context.username.set('Rick Sanchez');
            context.loggedIn.set(true);
        }
    }
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
        { which: 'handin', color: 'purple', label: 'Aflever', icon: faBook },
        { which: 'logout', color: 'red', label: 'Afslut', icon: faSignOutAlt }
    ];

    function onButtonPress(which) {
        if (which === 'logout') {
            context.username.set('');
            context.loggedIn.set(false);
            context.step.set('initial');
        } else {
            context.step.set(which);
        }
    }

    return (
        <div className={classes}>
            <div className="flex-container-row">
        Biblioteket
                {context.loggedIn && (
                    <span className="username">{context.username.get}</span>
                )}
                <button onClick={() => login()}>Login logout</button>
            </div>
            <div className="flex-container-row">
                {context.loggedIn.get &&
          components.map((button) => (
              <Button
                  key={button.which}
                  label={button.label}
                  icon={button.icon}
                  handleButtonPress={onButtonPress}
                  color={button.color}
                  which={button.which}
              ></Button>
          ))}
            </div>
        </div>
    );
}
NavBar.propTypes = {};

export default NavBar;
