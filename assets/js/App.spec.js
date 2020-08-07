/**
 * @file
 * Tests for App.
 */

import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import { it } from '@jest/globals';

it('renders without crashing', () => {
    shallow(<App />);
});
