/**
 * @file
 *
 * Tests of typelogin
 */

import React from "react";
import TypeLogin from "./TypeLogin";
import { shallow } from "enzyme";
import { it } from "@jest/globals";

it("renders without crashing", () => {
    shallow(<TypeLogin actionHandler={() => {}} />);
});
