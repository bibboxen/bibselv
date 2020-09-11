/**
 * @file
 *
 * Tests of unilogin
 */

import React from "react";
import UniLogin from "./UniLogin";
import { shallow } from "enzyme";
import { it } from "@jest/globals";

it("renders without crashing", () => {
    shallow(<UniLogin actionHandler={() => {}} />);
});
