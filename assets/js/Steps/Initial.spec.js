import React from 'react';
import Initial from './Initial';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
    shallow(<Initial />);
});
