/**
 * @file
 * Tests of Bubble.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import IconBubble from './icon-bubble';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

describe('Tests of icon bubble component', () => {
    it('renders without crashing', () => {
        shallow(<IconBubble type='icon-bubble-text' icon={faCheck} />);
    });

    it('renders type css-class', () => {
        const wrapper = mount(<IconBubble type='icon-bubble-text' icon={faCheck} />);
        expect(wrapper.exists('.icon-bubble-text')).toEqual(true);
    });

    it('renders icon', () => {
        const wrapper = mount(<IconBubble type='icon-bubble-text' icon={faCheck} />);
        expect(wrapper.exists('.icon')).toEqual(true);
    });
});
