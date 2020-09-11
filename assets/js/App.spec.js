/**
 * @file
 * Tests of App.
 */

import React from "react";
import App from "./App";
import { shallow, mount } from "enzyme";
import { expect, it, describe } from "@jest/globals";

it("renders without crashing", () => {
    shallow(<App initialState={{ step: "loading" }} />);
});

describe("Initial component (Vælg en funktion...)", () => {
    it("Renders the initial component when state is initial and it is logged out", () => {
        let wrapper = mount(<App initialState={{ step: "initial" }} />);
        expect(
            wrapper.contains(
                <h1 className="mb-5">Vælg en funktion for at starte</h1>
            )
        ).toEqual(true);
    });
});

describe("Check out items component (Udlån)", () => {
    it("Renders login component when it is logged out", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkOutItems",
                    step: "loginScan",
                    items: [],
                }}
            />
        );
        expect(wrapper.contains(<div className="header">Login</div>)).toEqual(
            true
        );
    });

    it("Renders login component when logged out, even if there is items", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkOutItems",
                    step: "loginScan",
                    items: [
                        {
                            id: "5313004378",
                            recallDate: 1598832000000,
                            title: "Illustreret svampeflora",
                            author: "Lange, Morten",
                            DK5: "57.4",
                            status: "error",
                            message: "Fejl",
                        },
                    ],
                }}
            />
        );

        expect(wrapper.contains(<div className="header">Login</div>)).toEqual(
            true
        );
    });

    it("Renders check out items component when it is logged in", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkOutItems",
                    step: "checkOutItems",
                    user: {
                        birthdayToday: false,
                        name: "ITK",
                    },
                    items: [],
                }}
            />
        );
        expect(wrapper.contains(<div className="header">Lån</div>)).toEqual(
            true
        );
    });

    it("Renders item (book) with error in check out items component when logged in", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkOutItems",
                    step: "checkOutItems",
                    user: {
                        birthdayToday: false,
                        name: "ITK",
                    },
                    items: [
                        {
                            id: "5313004378",
                            recallDate: 1598832000000,
                            title: "Illustreret svampeflora",
                            author: "Lange, Morten",
                            DK5: "57.4",
                            status: "error",
                            message: "Fejl",
                        },
                    ],
                }}
            />
        );

        expect(wrapper.contains(<div className="header">Fejl</div>)).toEqual(
            true
        );
    });

    it("Renders item (book) in progress in check out items component when logged in", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkOutItems",
                    step: "checkOutItems",
                    user: {
                        birthdayToday: false,
                        name: "ITK",
                    },
                    items: [
                        {
                            id: "5313004343",
                            returnDate: 1600992000000,
                            status: "inProgress",
                            itemIdentifier: 123,
                        },
                    ],
                }}
            />
        );

        expect(
            wrapper.contains(<div className="header">Henter informationer</div>)
        ).toEqual(true);
    });

    it("Renders item (book) that is checked in check out items component when logged in", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkOutItems",
                    step: "checkOutItems",
                    user: {
                        birthdayToday: false,
                        name: "ITK",
                    },
                    items: [
                        {
                            id: "5313004327",
                            returnDate: 1599436800000,
                            title: "Insekter i farver",
                            author: "Ravn, Hans Peter",
                            status: "checkedIn",
                        },
                    ],
                }}
            />
        );
        expect(
            wrapper.contains(<div className="header">Insekter i farver</div>)
        ).toEqual(true);
    });
});

describe("Check in items component (Aflever)", () => {
    it("Renders check in items component when it is logged out", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkInItems",
                    step: "checkInItems",
                    items: [],
                }}
            />
        );
        expect(wrapper.contains(<div className="header">Aflever</div>)).toEqual(
            true
        );
    });

    it("Renders item (book) with error in check in items component when logged out", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkInItems",
                    step: "checkInItems",
                    items: [
                        {
                            id: "5313004378",
                            recallDate: 1598832000000,
                            title: "Illustreret svampeflora",
                            author: "Lange, Morten",
                            DK5: "57.4",
                            status: "error",
                            message: "Fejl",
                        },
                    ],
                }}
            />
        );

        expect(wrapper.contains(<div className="header">Fejl</div>)).toEqual(
            true
        );
    });

    it("Renders item (book) in progress in check in items component when logged out", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkInItems",
                    step: "checkInItems",
                    items: [
                        {
                            id: "5313004343",
                            returnDate: 1600992000000,
                            status: "inProgress",
                            itemIdentifier: 123,
                        },
                    ],
                }}
            />
        );

        expect(
            wrapper.contains(<div className="header">Henter informationer</div>)
        ).toEqual(true);
    });

    it("Renders item (book) that is checked in check in items component when logged out", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkInItems",
                    step: "checkInItems",
                    user: {
                        birthdayToday: false,
                        name: "ITK",
                    },
                    items: [
                        {
                            id: "5313004327",
                            returnDate: 1599436800000,
                            title: "Insekter i farver",
                            author: "Ravn, Hans Peter",
                            status: "checkedIn",
                        },
                    ],
                }}
            />
        );
        expect(
            wrapper.contains(<div className="header">Insekter i farver</div>)
        ).toEqual(true);
    });

    it("Renders check in items component when it is logged in", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkInItems",
                    step: "checkInItems",
                    user: {
                        birthdayToday: false,
                        name: "ITK",
                    },
                    items: [],
                }}
            />
        );
        expect(wrapper.contains(<div className="header">Aflever</div>)).toEqual(
            true
        );
    });

    it("Renders item (book) with error in check in items component when logged in", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkInItems",
                    step: "checkInItems",
                    user: {
                        birthdayToday: false,
                        name: "ITK",
                    },
                    items: [
                        {
                            id: "5313004378",
                            recallDate: 1598832000000,
                            title: "Illustreret svampeflora",
                            author: "Lange, Morten",
                            DK5: "57.4",
                            status: "error",
                            message: "Fejl",
                        },
                    ],
                }}
            />
        );

        expect(wrapper.contains(<div className="header">Fejl</div>)).toEqual(
            true
        );
    });

    it("Renders item (book) in progress in check in items component when logged in", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkInItems",
                    step: "checkInItems",
                    user: {
                        birthdayToday: false,
                        name: "ITK",
                    },
                    items: [
                        {
                            id: "5313004343",
                            returnDate: 1600992000000,
                            status: "inProgress",
                            itemIdentifier: 123,
                        },
                    ],
                }}
            />
        );

        expect(
            wrapper.contains(<div className="header">Henter informationer</div>)
        ).toEqual(true);
    });

    it("Renders item (book) that is checked in check in items component when logged in", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkInItems",
                    step: "checkInItems",
                    user: {
                        birthdayToday: false,
                        name: "ITK",
                    },
                    items: [
                        {
                            id: "5313004327",
                            returnDate: 1599436800000,
                            title: "Insekter i farver",
                            author: "Ravn, Hans Peter",
                            status: "checkedIn",
                        },
                    ],
                }}
            />
        );
        expect(
            wrapper.contains(<div className="header">Insekter i farver</div>)
        ).toEqual(true);
    });
});

describe("Status component", () => {
    it("Renders the login page, when state is status and it is not logged in", () => {
        let wrapper = mount(
            <App initialState={{ flow: "status", step: "loginScan" }} />
        );
        expect(wrapper.contains(<div className="header">Login</div>)).toEqual(
            true
        );
    });

    it("Renders the status component when the state is status and it is logged in", () => {
        let wrapper = mount(
            <App
                initialState={{
                    step: "status",
                    flow: "status",
                    user: {
                        name: "ITK",
                        birthdayToday: false,
                    },
                    statusRefreshing: false,
                    holdItems: [],
                    overdueItems: [],
                    chargedItems: [],
                    fineItems: [],
                    recallItems: [],
                    unavailableHoldItems: [],
                }}
            />
        );
        expect(wrapper.contains(<div className="header">Status</div>)).toEqual(
            true
        );
    });

    it("Renders the books from machine state when the state is status, it is logged in and there are books", () => {
        let wrapper = mount(
            <App
                initialState={{
                    step: "status",
                    flow: "status",
                    user: {
                        name: "ITK",
                        birthdayToday: false,
                    },
                    statusRefreshing: false,
                    holdItems: [
                        {
                            id: "5313004327",
                            returnDate: 1599436800000,
                            title: "Insekter i farver",
                            author: "Ravn, Hans Peter",
                        },
                    ],
                    overdueItems: [
                        {
                            id: "5313004555",
                            dueDate: 1598832000032,
                            title: "Open book",
                            author: "Simpson, Jessica",
                        },
                    ],
                    chargedItems: [
                        {
                            id: "5313004319",
                            returnDate: 1599436800000,
                            title: "Mellem rejer og hundestejler",
                            author: "Møller Christensen, Jørgen",
                        },
                    ],
                    fineItems: [
                        {
                            id: "5313004343",
                            returnDate: 1600992000000,
                            title: "Den lille bog om søgning på nettet",
                            author: "Knudsen, Werner",
                        },
                    ],
                    recallItems: [
                        {
                            id: "5313004378",
                            recallDate: 1598832000000,
                            title: "Illustreret svampeflora",
                            author: "Lange, Morten",
                            DK5: "57.4",
                        },
                    ],
                    unavailableHoldItems: [
                        {
                            id: "5313004351",
                            recallDate: 1598832000000,
                            title:
                                "Det eksperimenterende billedværksted: [Bind] 1: indføring i den kunstneriske proces",
                            author: "Holm, Anna Marie",
                            DK5: "70.7",
                        },
                    ],
                }}
            />
        );
        expect(
            wrapper.contains(
                <div className="header">
                    Det eksperimenterende billedværksted: [Bind] 1: indføring i
                    den kunstneriske proces
                </div>
            )
        ).toEqual(true);
        expect(
            wrapper.contains(
                <div>Illustreret svampeflora af Lange, Morten</div>
            )
        ).toEqual(true);
        expect(
            wrapper.contains(
                <div>Den lille bog om søgning på nettet af Knudsen, Werner</div>
            )
        ).toEqual(true);
        expect(
            wrapper.contains(
                <div className="header">Mellem rejer og hundestejler</div>
            )
        ).toEqual(true);
        expect(
            wrapper.contains(<div className="header">Insekter i farver</div>)
        ).toEqual(true);
        expect(
            wrapper.contains(<div>Open book af Simpson, Jessica</div>)
        ).toEqual(true);
        expect(
            wrapper.contains(
                <div className="header">Bogtitel som ikke eksisterer</div>
            )
        ).toEqual(false);
    });
});



describe("Tests of navbar component", () => {

    it("Renders the navbar component when state is initial", () => {
        let wrapper = mount(
            <App
                initialState={{
                    step: "initial",
                    // user: {
                    //     birthdayToday: false,
                    //     name: "ITK",
                    // },
                }}
            />
        );
        expect(wrapper.exists(".navbar")).toEqual(true);
        expect(wrapper.exists(".initial")).toEqual(true);
    });

    // Todo test name of library
    // Todo test name of logged in user


    it("Renders the navbar component when state is initial", () => {
        let wrapper = mount(
            <App
                initialState={{
                    flow: "checkInItems",
                    step: "checkInItems",
                    items: [],
                    // user: {
                    //     birthdayToday: false,
                    //     name: "ITK",
                    // },
                }}
            />
        );
        console.log(wrapper.debug())
        expect(wrapper.exists(".navbar")).toEqual(true);
        expect(wrapper.exists(".initial")).toEqual(true);
    });
});
