import React from "react";
import Bibbox from "../../assets/js/steps/Bibbox";
import { CONNECTION_ONLINE } from "../../assets/js/constants";
import messages from "../../public/lang/da-comp.json";
import { IntlProvider } from "react-intl";
import MachineStateContext from "../../assets/js/steps/utils/MachineStateContext";

describe("Login flows", () => {
  it("loginScanUsernamePassword is rendered and responds to barcode interaction", () => {
    const mock = {
      actionHandler: (arg) => {
        return arg;
      },
    };
    cy.stub(mock, "actionHandler").as("actionHandlerStub");
    cy.mount(
      <MachineStateContext.Provider
        value={{
          errorMessage: null,
          connectionState: CONNECTION_ONLINE,
          boxConfig: {
            barcodeTimeout: 0,
            id: 25,
            hasPrinter: true,
            reservedMaterialInstruction:
              "Dolor est ut ea natus iusto deserunt inventore.",
            inactivityTimeOut: 360000,
            soundEnabled: false,
            school: {
              name: "Beder Skole",
            },
            loginMethod: "azure_ad_login",
            adLoginState: {
              state: "checkoutitems",
              accountType: "student",
              userName: "test1234",
            },
            hasTouch: false,
            hasKeyboard: true,
            sip2User: {
              username: "test_test",
              password: "12345678",
              agencyId: "DK-718680",
              location: "Kalvehave",
            },
            defaultPassword: "0000",
            debugEnabled: false,
            defaultLanguageCode: "da",
            hasFrontpageCheckIn: true,
          },
          machineState: {
            step: "loginScanUsernamePassword",
            flow: "status",
          },
        }}
      >
        <IntlProvider locale="da" messages={messages}>
          <Bibbox actionHandler={mock.actionHandler} />
        </IntlProvider>
      </MachineStateContext.Provider>
    );

    // Navbar, correct schoole name and "reset button exists"
    cy.get('[data-cy="navbar"]')
      .find(".text")
      .should("have.text", "Beder Skole");

    cy.get('[data-cy="navbar"]')
      .find('[data-cy="logout"]')
      .should("have.text", "Afslut")
      .find(".button-barcode")
      .should("exist");

    // Correct header
    cy.get('[data-cy="page-header"]').should("have.text", "Login");
    cy.get('[data-cy="sub-header"]').should(
      "have.text",
      "Brug scanneren til at scanne stregkoden på dit bibliotekskort"
    );

    // user login with barcode
    cy.get("body").trigger("keypress", { key: "!BA03123!C" });

    // Page now displays password input
    cy.get('[data-cy="navbar"]')
      .find('[data-cy="logout"]')
      .should("have.text", "Afslut")
      .find(".button-barcode")
      .should("exist");
    cy.get('[data-cy="page-header"]').should("have.text", "Login");
    cy.get('[data-cy="sub-header"]').should(
      "have.text",
      "Indtast din adgangskode"
    );
    cy.get("input").should("exist");
  });

  it("loginScanUsername is rendered and responds to barcode interaction", () => {
    const mock = {
      actionHandler: (arg) => {
        return arg;
      },
    };
    cy.stub(mock, "actionHandler").as("actionHandlerStub");
    cy.mount(
      <IntlProvider locale="da" messages={messages}>
        <MachineStateContext.Provider
          value={{
            errorMessage: null,
            connectionState: CONNECTION_ONLINE,
            boxConfig: {
              barcodeTimeout: 0,
              id: 25,
              hasPrinter: true,
              reservedMaterialInstruction:
                "Dolor est ut ea natus iusto deserunt inventore.",
              inactivityTimeOut: 360000,
              soundEnabled: false,
              school: {
                name: "Beder Skole",
              },
              loginMethod: "azure_ad_login",
              adLoginState: {
                state: "checkoutitems",
                accountType: "student",
                userName: "test1234",
              },
              hasTouch: false,
              hasKeyboard: true,
              sip2User: {
                username: "test_test",
                password: "12345678",
                agencyId: "DK-718680",
                location: "Kalvehave",
              },
              defaultPassword: "0000",
              debugEnabled: false,
              defaultLanguageCode: "da",
              hasFrontpageCheckIn: true,
            },
            machineState: {
              step: "loginScanUsername",
              flow: "status",
            },
          }}
        >
          <Bibbox actionHandler={mock.actionHandler} />
        </MachineStateContext.Provider>
      </IntlProvider>
    );

    // Navbar, correct school name and "reset button exists"
    cy.get('[data-cy="navbar"]')
      .find(".text")
      .should("have.text", "Beder Skole");

    cy.get('[data-cy="navbar"]')
      .find('[data-cy="logout"]')
      .should("have.text", "Afslut")
      .find(".button-barcode")
      .should("exist");

    // Correct header
    cy.get('[data-cy="page-header"]').should("have.text", "Login");
    cy.get('[data-cy="sub-header"]').should(
      "have.text",
      "Scan din lånerstregkode"
    );

    // Barcode input: reset
    cy.get("body").trigger("keypress", { key: "!BA03006!C" });
    cy.get("@actionHandlerStub").should("be.calledWith", "reset");
  });
});
