/**
 * @file
 * Tests of App.
 */

import React from 'react';
import App from './app';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';

it('renders without crashing', () => {
    shallow(<App token='123' socket={{ fake: 'socket' }} />);
});
