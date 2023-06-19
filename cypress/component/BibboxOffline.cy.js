import React from "react";
import Bibbox from "../../assets/js/steps/Bibbox";
import { CONNECTION_OFFLINE } from "../../assets/js/constants";
import messages from "../../public/lang/da-comp.json";
import { IntlProvider } from "react-intl";

describe("Offline", () => {
  it("Connectionstate offline", () => {
    const mock = {
      actionHandler: (arg) => {
        return arg;
      },
    };
    cy.stub(mock, "actionHandler").as("actionHandlerStub");
    cy.mount(
      <IntlProvider locale="da" messages={messages}>
        <Bibbox
          boxConfigurationInput={{
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
          }}
          machineStateInput={{
            step: "loginScanUsernamePassword",
            flow: "status",
          }}
          errorMessage={"Sikke noget!"}
          connectionState={CONNECTION_OFFLINE}
          actionHandler={mock.actionHandler}
        />
      </IntlProvider>
    );
    cy.get('[data-cy="navbar"]')
      .find(".text")
      .should("have.text", "Beder Skole");

    cy.get('[data-cy="navbar"]')
      .find('[data-cy="logout"]')
      .should("have.text", "Afslut")
      .find(".button-barcode")
      .should("exist");

    cy.get('[data-cy="alert"]').should("have.text", "Sikke noget!");

    // Barcode input: reset
    cy.get("body").trigger("keypress", { key: "!BA03006!C" });
    cy.get("@actionHandlerStub").should("not.be.called");

    // Barcode input: checkOutItems
    cy.get("body").trigger("keypress", { key: "!BA03009!C" });
    cy.get("@actionHandlerStub").should("not.be.called");

    // Barcode input: checkInItems
    cy.get("body").trigger("keypress", { key: "!BA03010!C" });
    cy.get("@actionHandlerStub").should("not.be.called");

    // Barcode input: status
    cy.get("body").trigger("keypress", { key: "!BA03020!C" });
    cy.get("@actionHandlerStub").should("not.be.called");
  });
});
