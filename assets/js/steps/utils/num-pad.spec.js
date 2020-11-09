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
        shallow(<NumPad okButtonLabel='' deleteButtonLabel='' handleNumpadPress={() => console.log()} />);
    });

    it('renders from 1 to 9, delete, zero and ok', () => {
        const wrapper = mount(
            <NumPad okButtonLabel='' deleteButtonLabel='' handleNumpadPress={() => console.log()} />
        );
        expect(wrapper.text()).toEqual('1234567890');
    });

    it('renders from 1 to 9, inputted delete, zero and inputted ok', () => {
        const wrapper = mount(
            <NumPad okButtonLabel='okidoki' deleteButtonLabel='delete' handleNumpadPress={() => console.log()} />
        );
        expect(wrapper.text()).toEqual('123456789delete0okidoki');
    });

    it('works when a button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(<NumPad okButtonLabel='' deleteButtonLabel='' handleNumpadPress={mockCallBack} />);
        wrapper.find('.button-numpad').forEach((node) => {
            node.simulate('click');
        });
        expect(mockCallBack.mock.calls.length).toEqual(12);
    });
});
