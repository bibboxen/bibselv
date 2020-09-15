/**
 * @file
 *
 * Tests of ScanPasswordLogin
 */

import React from "react";
import ScanPasswordLogin from "./ScanPasswordLogin";
import { shallow, mount } from "enzyme";
import { it } from "@jest/globals";

it("renders without crashing", () => {
    shallow(<ScanPasswordLogin actionHandler={() => {}} />);
});

it("renders initial sub header", () => {
    const wrapper = mount(<ScanPasswordLogin actionHandler={() => {}} />);
    console.log(wrapper.debug());
    expect(wrapper.find(".sub-header").text()).toEqual(
        "Scan dit bibliotekskort"
    );
});

// it("renders second subheader on change in state", () => {
//     const wrapper = mount(<ScanPasswordLogin actionHandler={() => {}} />);
//     console.log(wrapper.debug());
//     keypresses([33, 66, 65, 67, 48, 50, 51, 54, 52, 56, 54, 55, 52, 33, 67]);
//     expect(wrapper.find(".sub-header").text()).toEqual(
//         "Scadn dit bibliotekskort"
//     );
// });

// function keypresses(arrayOfKeypresses) {
//     arrayOfKeypresses.forEach((element) => {
//         keypress(element);
//     });
// }

// function keypress(keyCode) {
//     let event = new KeyboardEvent("keypress", { keyCode: keyCode });
//     document.dispatchEvent(event);
// }
