/**
 * @file
 * Tests of Bubble.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import NumPad from './num-pad';

describe('Tests of numpad component', () => {
    it('renders without crashing', () => {
        shallow(<NumPad handleNumpadPress={() => console.log()} />);
    });

    it('renders from 1 to 9, number sign, zero and C', () => {
        const wrapper = mount(
            <NumPad handleNumpadPress={() => console.log()} />
        );
        expect(wrapper.text()).toEqual('123456789Slet0Ok');
    });

    it('renders from 1 to 9, number sign, zero and C', () => {
        const wrapper = mount(
            <NumPad deleteButtonLabel="delete" okButtonLabel="okidoki" handleNumpadPress={() => console.log()} />
        );
        expect(wrapper.text()).toEqual('123456789delete0okidoki');
    });

    it('works when a button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(<NumPad handleNumpadPress={mockCallBack} />);
        wrapper.find('.button-numpad').forEach((node) => {
            node.simulate('click');
        });
        expect(mockCallBack.mock.calls.length).toEqual(12);
    });
});
