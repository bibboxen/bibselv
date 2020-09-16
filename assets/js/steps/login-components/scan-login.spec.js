/**
 * @file
 *
 * Tests of scanlogin
 */

import React from 'react';
import ScanLogin from './scan-login';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';

it('renders without crashing', () => {
    shallow(<ScanLogin actionHandler={() => {}} />);
});
