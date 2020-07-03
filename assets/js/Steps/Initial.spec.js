import React from 'react';
import Initial from './Initial';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';

it('renders without crashing', () => {
    shallow(<Initial actionHandler={() => {}} />);
});
