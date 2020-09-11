/**
 * @file
 * Tests of Bannerlist.
 */

import React from "react";
import BannerList from "./BannerList";
import { shallow, mount } from "enzyme";
import { expect, it, describe } from "@jest/globals";

describe("Test of bannerlist component", () => {
    it("Renders without crashing", () => {
        shallow(
            <BannerList
                items={[
                    {
                        id: "1",
                        title: "Illustreret svampeflora",
                        author: "Lange, Morten",
                        status: "error",
                    },
                ]}
            />
        );
    });

    it("Renders title and counter", () => {
        const wrapper = mount(
            <BannerList
                items={[
                    {
                        id: "1",
                        title: "Illustreret svampeflora",
                        author: "Lange, Morten",
                        status: "error",
                    },
                ]}
                title="bannerlist"
            />
        );
        expect(wrapper.find(".counter").text()).toEqual("1");
    });

    it("does not render counter without title", () => {
        const wrapper = mount(
            <BannerList
                items={[
                    {
                        id: "1",
                        recallDate: 1598832000000,
                        title: "Illustreret svampeflora",
                        author: "Lange, Morten",
                        status: "error",
                    },
                ]}
            />
        );
        expect(wrapper.exists(".counter")).toEqual(false);
    });

    it("renders a counter that can count 2", () => {
        const wrapper = mount(
            <BannerList
                items={[
                    {
                        id: "1",
                        title: "Illustreret svampeflora",
                        author: "Lange, Morten",
                        status: "success",
                    },    {
                        id: "2",
                        title: "Illustreret svampeflora",
                        author: "Lange, Morten",
                        status: "success",
                    }
                ]}
                title="bannerlist"
            />
        );
        expect(wrapper.find(".counter").text()).toEqual("2");
    });
});
