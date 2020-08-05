import React from 'react';
import Initial from './Initial';
import MachineStateContext from '../context/machineStateContext';
import { shallow, mount } from 'enzyme';
import { expect, it } from '@jest/globals';

it('renders without crashing', () => {
    const machineState = {
        step: {
            name: 'initial'
        }
    };
    shallow(
        <MachineStateContext.Provider value={machineState}>
            <Initial actionHandler={() => {}} />
        </MachineStateContext.Provider>
    );
});

it('renders three bubbles', () => {
    const machineState = {
        step: {
            name: 'initial'
        }
    };
    const wrapper = mount(
        <MachineStateContext.Provider value={machineState}>
            <Initial actionHandler={() => {}} />
        </MachineStateContext.Provider>
    );

    console.log(wrapper);
    expect(wrapper).to(<h1 className="mb-5">Vælg en funktion for at starte</h1>);
});
