/**
 * @file
 * Tests of ScanPasswordLogin
 */

import React from 'react';
import ScanPasswordLogin from './scan-password-login';
import { shallow, mount } from 'enzyme';
import { it } from '@jest/globals';

it('renders without crashing', () => {
    shallow(<ScanPasswordLogin actionHandler={() => {}} />);
});
