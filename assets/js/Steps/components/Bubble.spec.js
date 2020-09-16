/**
 * @file
 * Tests of Bubble.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import Bubble from './Bubble';

describe('Tests of bubble component', () => {
    it('renders without crashing', () => {
        shallow(
            <Bubble
                which='checkInItems'
                label='Bubble'
                icon=''
                actionHandler={() => console.log()}
            />
        );
    });

    it('renders which css-class', () => {
        const wrapper = mount(
            <Bubble
                which='bubble-test'
                label='Bubble'
                icon=''
                actionHandler={() => console.log()}
            />
        );
        expect(wrapper.exists('.bubble-test')).toEqual(true);
    });

    it('renders label', () => {
        const wrapper = mount(
            <Bubble
                which='bubble-test'
                label='Bubble'
                icon=''
                actionHandler={() => console.log()}
            />
        );
        expect(wrapper.text()).toEqual('Bubble');
    });

    it('renders icon', () => {
        const wrapper = mount(
            <Bubble
                which='bubble-test'
                label='Bubble'
                icon=''
                actionHandler={() => console.log()}
            />
        );
        expect(wrapper.exists('.icon')).toEqual(true);
    });

    it('works when bubble is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = shallow(
            <Bubble
                which='bubble-test'
                label='Bubble'
                icon=''
                actionHandler={mockCallBack}
            />
        );
        wrapper.find('.bubble').simulate('click');
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });
});
