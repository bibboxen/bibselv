/**
 * @file
 * Tests of unilogin
 */

import React from 'react';
import UniLogin from './uni-login';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';

it('renders without crashing', () => {
    shallow(<UniLogin actionHandler={() => {}} />);
});
