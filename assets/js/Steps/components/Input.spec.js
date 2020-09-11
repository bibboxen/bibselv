/**
 * @file
 * Tests of Bubble.
 */

import React from "react";
import { shallow, mount } from "enzyme";
import { expect, it, describe } from "@jest/globals";
import Input from "./Input";
describe("Tests of input component", () => {
    it("renders without crashing", () => {
        shallow(
            <Input
                name="input-test"
                label="input-label"
                value="123"
                which="icon-bubble-text"
            />
        );
    });

    it("renders the label", () => {
        const wrapper = mount(
            <Input
                name="input-test"
                label="input-label"
                value=""
                which="icon-bubble-text"
            />
        );
        expect(wrapper.find("label").text()).toEqual("input-label");
    });

    it("renders the input", () => {
        const wrapper = mount(
            <Input
                name="input-test"
                label="input-label"
                value=""
                which="icon-bubble-text"
            />
        );
        expect(
            wrapper.contains(
                <input
                    value=""
                    name="input-test"
                    id="input-test"
                    type="input-test"
                />
            )
        ).toEqual(true);
    });

    it("renders info class if which is checkoutitems", () => {
        const wrapper = mount(
            <Input
                name="input-test"
                label="input-label"
                value=""
                which="checkoutitems"
            />
        );
        expect(wrapper.exists(".info")).toEqual(true);
    });

    it("renders purple class if which is not checkoutitems", () => {
        const wrapper = mount(
            <Input
                name="input-test"
                label="input-label"
                value=""
                which="test"
            />
        );
        expect(wrapper.exists(".purple")).toEqual(true);
    });

    it("renders info banner on which and value", () => {
        const wrapper = mount(
            <Input
                name="input-test"
                label="input-label"
                value="123"
                which="test"
            />
        );
        expect(wrapper.find(".info-banner").text()).toEqual(
            "Bogen blev registreret. Klar til næste"
        );
    });

    it("renders value", () => {
        const wrapper = mount(
            <Input
                name="input-test"
                label="input-label"
                value="123"
                which="test"
            />
        );
        expect(
            wrapper.contains(
                <input
                    value="123"
                    name="input-test"
                    id="input-test"
                    type="input-test"
                />
            )
        ).toEqual(true);
    });
});
