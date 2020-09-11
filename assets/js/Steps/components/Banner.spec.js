/**
 * @file
 * Tests of Banner.
 */

import React from "react";
import Banner from "./Banner";
import { shallow, mount } from "enzyme";
import { expect, it, describe } from "@jest/globals";

describe("Test of banner component", () => {
    it("Renders without crashing", () => {
        shallow(
            <Banner
                item={{
                    id: "5313004378",
                    recallDate: 1598832000000,
                    title: "Illustreret svampeflora",
                    author: "Lange, Morten",
                    status: "error",
                    message: "Fejl",
                }}
            />
        );
    });

    it("Renders title", () => {
        const wrapper = mount(
            <Banner
                item={{
                    text: "Af morten lange",
                    title: "Illustreret svampeflora",
                    status: "error",
                    itemIdentifier: 123,
                }}
            />
        );
        expect(wrapper.contains(<div className="header">Illustreret svampeflora</div>)).toEqual(
            true
        );
    });
    it("Renders text", () => {
        const wrapper = mount(
            <Banner
                item={{
                    text: "Af morten lange",
                    title: "",
                    status: "error",
                    itemIdentifier: 123,
                }}
            />
        );
        expect(wrapper.text()).toEqual("Af morten lange");
    });
    it("Renders css-classes by state", () => {
        const wrapper = mount(
            <Banner
                item={{
                    text: "",
                    title: "",
                    status: "error",
                    itemIdentifier: 123,
                }}
            />
        );
        expect(wrapper.exists(".danger")).toEqual(true);
    });

    it("Renders css-classes by state renewed", () => {
        const wrapper = mount(
            <Banner
                item={{
                    text: "",
                    title: "",
                    status: "renewed",
                    itemIdentifier: 123,
                }}
            />
        );
        expect(wrapper.exists(".success")).toEqual(true);
    });

    it("Renders css-classes by state checked out", () => {
        const wrapper = mount(
            <Banner
                item={{
                    text: "",
                    title: "",
                    status: "checkedOut",
                    itemIdentifier: 123,
                }}
            />
        );
        expect(wrapper.exists(".success")).toEqual(true);
    });

    it("Renders css-classes by state checked in", () => {
        const wrapper = mount(
            <Banner
                item={{
                    text: "",
                    title: "",
                    status: "checkedIn",
                    itemIdentifier: 123,
                }}
            />
        );
        expect(wrapper.exists(".success")).toEqual(true);
    });

    it("Renders css-classes by state success", () => {
        const wrapper = mount(
            <Banner
                item={{
                    text: "",
                    title: "",
                    status: "success",
                    itemIdentifier: 123,
                }}
            />
        );
        expect(wrapper.exists(".success")).toEqual(true);
    });

    it("Renders css-classes and item identifier by state in progress", () => {
        const wrapper = mount(
            <Banner
                item={{
                    text: "",
                    title: "",
                    status: "inProgress",
                    itemIdentifier: 123,
                }}
            />
        );
        expect(wrapper.exists(".banner")).toEqual(true);
        expect(wrapper.text()).toEqual("123");
    });


    it("Renders title by state in progress", () => {
        const wrapper = mount(
            <Banner
                item={{
                    text: "",
                    title: "Af morten lange",
                    status: "inProgress",
                    itemIdentifier: "",
                }}
            />
        );
        expect(wrapper.text()).toEqual("Af morten lange");
    });
});
