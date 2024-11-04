/**
 * @file
 * Translations for the interface.
 */

import React from "react";
import { FormattedMessage } from "react-intl";

// Scan password login strings.
export const ScanPasswordLoginFirstSubheader = (
  <FormattedMessage
    id="scan-login-password-first-subheader"
    defaultMessage="scan-login-password-first-subheader"
  />
);
export const ScanPasswordLoginSecondSubheader = (
  <FormattedMessage
    id="scan-login-password-second-subheader"
    defaultMessage="scan-login-password-second-subheader"
  />
);
export const ScanPasswordLoginInputLabel = (
  <FormattedMessage
    id="scan-login-password-input-label"
    defaultMessage="scan-login-password-input-label"
  />
);
export const ScanPasswordLoginHeader = (
  <FormattedMessage
    id="scan-login-password-header"
    defaultMessage="scan-login-password-header"
  />
);

// Check in items strings.
export const CheckInItemsOkButton = (
  <FormattedMessage
    id="check-in-items-ok-button"
    defaultMessage="check-in-items-ok-button"
  />
);
export const CheckInItemsDeleteButton = (
  <FormattedMessage
    id="check-in-items-delete-button"
    defaultMessage="check-in-items-delete-button"
  />
);
export const CheckInItemsHelpBoxText = (
  <FormattedMessage
    id="check-in-items-help-box-text"
    defaultMessage="check-in-items-help-box-text"
  />
);
export const CheckInItemsInputLabel = (
  <FormattedMessage
    id="check-in-items-input-label"
    defaultMessage="check-in-items-input-label"
  />
);
export const CheckInItemsHeader = (
  <FormattedMessage
    id="check-in-items-header"
    defaultMessage="check-in-items-header"
  />
);
export const CheckInItemsSubheader = (
  <FormattedMessage
    id="check-in-items-subheader"
    defaultMessage="check-in-items-subheader"
  />
);

// Check out items strings.
export const CheckOutItemsOkButton = (
  <FormattedMessage
    id="check-out-items-ok-button"
    defaultMessage="check-out-items-ok-button"
  />
);
export const CheckOutItemsDeleteButton = (
  <FormattedMessage
    id="check-out-items-delete-button"
    defaultMessage="check-out-items-delete-button"
  />
);
export const CheckOutItemsHelpBoxText = (
  <FormattedMessage
    id="check-out-items-help-box-text"
    defaultMessage="check-out-items-help-box-text"
  />
);
export const CheckOutItemsInputLabel = (
  <FormattedMessage
    id="check-out-items-input-label"
    defaultMessage="check-out-items-input-label"
  />
);
export const CheckOutItemsHeader = (
  <FormattedMessage
    id="check-out-items-header"
    defaultMessage="check-out-items-header"
  />
);
export const CheckOutItemsSubheader = (
  <FormattedMessage
    id="check-out-items-subheader"
    defaultMessage="check-out-items-subheader"
  />
);

// Status strings.
export const StatusHeader = (
  <FormattedMessage id="status-header" defaultMessage="status-header" />
);
export const StatusHeaderPrint = (
  <FormattedMessage
    id="status-header-print"
    defaultMessage="status-header-print"
  />
);
export const StatusSubheader = (
  <FormattedMessage id="status-subheader" defaultMessage="status-subheader" />
);
export const StatusHeaderCurrentLoans = (
  <FormattedMessage
    id="status-header-current-loans"
    defaultMessage="status-header-current-loans"
  />
);
export const StatusHeaderReservations = (
  <FormattedMessage
    id="status-header-reservations"
    defaultMessage="status-header-reservations"
  />
);
export const StatusHeaderReadyForPickup = (
  <FormattedMessage
    id="status-header-ready-for-pickup"
    defaultMessage="status-header-ready-for-pickup"
  />
);
export const StatusUnavailable = (
  <FormattedMessage
    id="status-unavailable"
    defaultMessage="status-unavailable"
  />
);
export const StatusButtonPrint = (
  <FormattedMessage
    id="button-status-print"
    defaultMessage="button-status-print"
  />
);

/**
 * Create HeaderOverdueBooks translation.
 * @param numberOfBooks
 * @returns {JSX.Element}
 * @constructor
 */
export function StatusBannerHeaderOverdueBooks(numberOfBooks) {
  return (
    <FormattedMessage
      id="banner-header-books-for-check-in"
      defaultMessage="banner-header-books-for-check-in"
      values={{ numberOfBooks }}
    />
  );
}

// Help box strings.
export const HelpBoxHeader = (
  <FormattedMessage id="help-box-header" defaultMessage="help-box-header" />
);

// Input strings.
export const InputBookIsRegistered = (
  <FormattedMessage
    id="book-is-registered"
    defaultMessage="book-is-registered"
  />
);

// Scan Login strings
export const ScanLoginHeader = (
  <FormattedMessage id="scan-login-header" defaultMessage="scan-login-header" />
);
export const ScanLoginSubheader = (
  <FormattedMessage
    id="scan-login-subheader"
    defaultMessage="scan-login-subheader"
  />
);

// Login strings
export const LoginLoginError = (
  <FormattedMessage id="login-error" defaultMessage="login-error" />
);

// Navbar strings
export const NavbarButtonCheckOut = (
  <FormattedMessage
    id="button-navbar-check-out"
    defaultMessage="button-navbar-check-out"
  />
);
export const NavbarButtonStatus = (
  <FormattedMessage
    id="button-navbar-status"
    defaultMessage="button-navbar-status"
  />
);
export const NavbarButtonCheckIn = (
  <FormattedMessage
    id="button-navbar-check-in"
    defaultMessage="button-navbar-check-in"
  />
);
export const NavbarButtonFinish = (
  <FormattedMessage
    id="button-navbar-finish"
    defaultMessage="button-navbar-finish"
  />
);
export const NavbarButtonReset = (
  <FormattedMessage
    id="button-navbar-reset"
    defaultMessage="button-navbar-reset"
  />
);
export const NavbarStopLoginSession = (
  <FormattedMessage
    id="navbar-stop-login-session"
    defaultMessage="navbar-stop-login-session"
  />
);
export const NavbarStartLoginSession = (
  <FormattedMessage
    id="navbar-start-login-session"
    defaultMessage="navbar-start-login-session"
  />
);

// Initial strings
export const InitialButtonCheckOut = (
  <FormattedMessage
    id="initial-button-check-out"
    defaultMessage="initial-button-check-out"
  />
);
export const InitialButtonStatus = (
  <FormattedMessage
    id="initial-button-status"
    defaultMessage="initial-button-status"
  />
);
export const InitialButtonCheckIn = (
  <FormattedMessage
    id="initial-button-check-in"
    defaultMessage="initial-button-check-in"
  />
);
export const InitialHeader = (
  <FormattedMessage
    id="initial-choose-a-function"
    defaultMessage="initial-choose-a-function"
  />
);

// Banner adapter strings
export const BannerAdapterFetchingInfo = (
  <FormattedMessage
    id="banner-adapter-fetching-info"
    defaultMessage="banner-adapter-fetching-info"
  />
);
/**
 * Returns a string with title and author.
 * @param {string} title The title.
 * @param {string} author The author.
 */
export function BannerTitleAuthor(title, author) {
  return (
    <FormattedMessage
      id="banner-title-author"
      defaultMessage="banner-title-author"
      values={{ title, author }}
    />
  );
}

// App strings
export const AppTokenNotValid = (
  <FormattedMessage
    id="app-token-not-valid"
    defaultMessage="app-token-not-valid"
  />
);
export const ServerError = (
  <FormattedMessage id="app-server-error" defaultMessage="app-server-error" />
);

// Print strings
export const PrintReservationNote = (
  <FormattedMessage
    id="print-reservation-note"
    defaultMessage="print-reservation-note"
  />
);

// Book banner
/**
 * Return a string of "by author".
 * @param author
 * @returns {JSX.Element}
 * @constructor
 */
export function BookBannerByAuthor(author) {
  return (
    <FormattedMessage
      id="book-banner-by-author"
      defaultMessage="book-banner-by-author"
      values={{ author }}
    />
  );
}
export const BookBannerWithoutAuthor = (
  <FormattedMessage
    id="book-banner-without-author"
    defaultMessage="book-banner-without-author"
  />
);

// change-login-method.js
export const ChangeLoginMethodPickLoginMethodHeader = (
  <FormattedMessage
    id="change-login-method-pick-login-method-header"
    defaultMessage="change-login-method-pick-login-method-header"
  />
);
export const ChangeLoginMethodHelpBoxHeader = (
  <FormattedMessage
    id="change-login-method-help-box-header"
    defaultMessage="change-login-method-help-box-header"
  />
);
export const ChangeLoginMethodHelpBoxMainText = (
  <FormattedMessage
    id="change-login-method-help-box-main-text"
    defaultMessage="change-login-method-help-box-main-text"
  />
);
export const ChangeLoginMethodStartHere = (
  <FormattedMessage
    id="change-login-method-start-here"
    defaultMessage="change-login-method-start-here"
  />
);
export const ChangeLoginMethodUsernamePassword = (
  <FormattedMessage
    id="change-login-method-username-password"
    defaultMessage="change-login-method-username-password"
  />
);
export const ChangeLoginMethodUsername = (
  <FormattedMessage
    id="change-login-method-username"
    defaultMessage="change-login-method-username"
  />
);

/**
 * Create ChangeLoginMethodTimeoutMessage translation.
 * @param seconds
 * @returns {JSX.Element}
 * @constructor
 */
export function ChangeLoginMethodTimeoutMessage(seconds) {
  // Ignoring seconds.
  const minutesForMessage = Math.floor(seconds / 60);
  return (
    <FormattedMessage
      id="change-login-method-timeout-message"
      defaultMessage="change-login-method-timeout-message"
      values={{ minutes: minutesForMessage }}
    />
  );
}

export const SocketIOOffline = (
  <FormattedMessage id="socket-io-offline" defaultMessage="socket-io-offline" />
);
export const SocketIOOfflineAction = (
  <FormattedMessage
    id="socket-io-offline-action"
    defaultMessage="socket-io-offline-action"
  />
);
export const SocketIOOfflineInformation = (
  <FormattedMessage
    id="socket-io-offline-information"
    defaultMessage="socket-io-offline-information"
  />
);
