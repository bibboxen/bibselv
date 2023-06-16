import React from "react";
import { CONNECTION_ONLINE } from "../../assets/js/constants";
import messages from "../../public/lang/da-comp.json";
import { IntlProvider } from "react-intl";
import BookStatus from "../../assets/js/steps/utils/book-status";
import Bibbox from "../../assets/js/steps/bibbox";

describe("Check in items", () => {
  it("Check in items is rendered and responds to mouse interaction", () => {
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
            id: 25,
            hasPrinter: false,
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
            step: "checkInItems",
            flow: "checkInItems",
            items: [
              {
                title: "Title checked in",
                author: "Author",
                status: BookStatus.CHECKED_IN,
              },
              {
                title: "Title error",
                author: "Author",
                status: BookStatus.ERROR,
                message: "Fejl",
              },
              {
                title: "Title reserved",
                author: "Author",
                status: BookStatus.RESERVED,
              },
              {
                title: "Title renewed and reserved",
                author: "Author",
                status: BookStatus.RENEWED,
                reservedByOtherUser: true,
              },
              {
                title: "Title renewed",
                author: "Author",
                status: BookStatus.RENEWED,
              },
              {
                title: "Title in progress",
                author: "Author",
                itemIdentifier: "123",
                status: BookStatus.IN_PROGRESS,
              },
            ],
          }}
          errorMessage={null}
          connectionState={CONNECTION_ONLINE}
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
    cy.get('[data-cy="navbar"]')
      .find('[data-cy="check-in-items"]')
      .should("have.text", "Aflever");
    cy.get('[data-cy="navbar"]')
      .find('[data-cy="check-out-items"]')
      .should("have.text", "Lån");
    cy.get('[data-cy="navbar"]')
      .find('[data-cy="status"]')
      .should("have.text", "Status");
    cy.get('[data-cy="page-header"]').should("have.text", "Aflever");
    cy.get('[data-cy="sub-header"]').should(
      "have.text",
      "Scan stregkoden på bogen du vil aflevere"
    );
    cy.get(".header-icon.checkinitems").should("exist");
    cy.get('[data-cy="help-box"]').should(
      "have.text",
      "HjælpBrug håndscanneren til at scanne stregkoden på bogen"
    );

    cy.get('[data-cy="banner"]')
      .eq(0)
      .should("have.text", "Henter informationer123")
      .should("have.css", "background-color", "rgb(85, 85, 85)");
    cy.get('[data-cy="banner"]')
      .eq(1)
      .should("have.text", "Title renewedTitle renewed af Author")
      .should("have.css", "background-color", "rgb(5, 245, 144)");
    cy.get('[data-cy="banner"]')
      .eq(2)
      .should(
        "have.text",
        "Dolor est ut ea natus iusto deserunt inventore.Title renewed and reserved af Author"
      )
      .should("have.css", "background-color", "rgb(233, 67, 67)");
    cy.get('[data-cy="banner"]')
      .eq(3)
      .should("have.text", "Title reservedTitle reserved af Author")
      .should("have.css", "background-color", "rgb(233, 67, 67)");
    cy.get('[data-cy="banner"]')
      .eq(4)
      .should("have.text", "FejlTitle error af Author")
      .should("have.css", "background-color", "rgb(233, 67, 67)");
    cy.get('[data-cy="banner"]')
      .eq(5)
      .should("have.text", "Title checked inTitle checked in af Author")
      .should("have.css", "background-color", "rgb(5, 245, 144)");

    // // Barcode input: checkInItems should not be called
    cy.get("body").trigger("keypress", { key: "!BA03010!C" });
    cy.get("@actionHandlerStub").should("not.be.called");
  });

  it("Check in items responds to barcode scanner", () => {
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
            id: 25,
            hasPrinter: false,
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
            step: "checkInItems",
            flow: "checkInItems",
            items: [
              {
                title: "Title checked in",
                author: "Author",
                status: BookStatus.CHECKED_IN,
                itemIdentifier: 1,
              },
              {
                title: "Title error",
                author: "Author",
                status: BookStatus.ERROR,
                message: "Fejl",
                itemIdentifier: 2,
              },
              {
                title: "Title reserved",
                author: "Author",
                status: BookStatus.RESERVED,
                itemIdentifier: 3,
              },
              {
                title: "Title renewed and reserved",
                author: "Author",
                status: BookStatus.RENEWED,
                reservedByOtherUser: true,
                itemIdentifier: 4,
              },
              {
                title: "Title renewed",
                author: "Author",
                status: BookStatus.RENEWED,
                itemIdentifier: 5,
              },
              {
                title: "Title in progress",
                author: "Author",
                status: BookStatus.IN_PROGRESS,
                itemIdentifier: 6,
              },
            ],
          }}
          errorMessage={null}
          connectionState={CONNECTION_ONLINE}
          actionHandler={mock.actionHandler}
        />
      </IntlProvider>
    );

    // Barcode input: valid barcode
    cy.get("body").trigger("keypress", { key: "!BD101234567891!C" });
    cy.get("@actionHandlerStub").should("not.be.called");

    // // Barcode input: Invalid barcode
    cy.get("body").trigger("keypress", { key: "!BK101234567891!C" });
    cy.get("@actionHandlerStub").should("not.be.called");

    // Barcode input: valid barcode
    cy.get("body").trigger("keypress", { key: "!BA1234567891!C" });
    cy.get("@actionHandlerStub").should("be.calledWith", "checkInItem", {
      itemIdentifier: "!BA1234567891!C",
    });

    // Barcode input: reset
    cy.get("body").trigger("keypress", { key: "!BA03006!C" });
    cy.get("@actionHandlerStub").should("be.calledWith", "reset");

    // Barcode input: checkOutItems
    cy.get("body").trigger("keypress", { key: "!BA03009!C" });
    cy.get("@actionHandlerStub").should("be.calledWith", "changeFlow", {
      flow: "checkOutItems",
    });

    // Barcode input: status
    cy.get("body").trigger("keypress", { key: "!BA03020!C" });
    cy.get("@actionHandlerStub").should("be.calledWith", "changeFlow", {
      flow: "status",
    });
  });
});
