/**
 * @file
 * Translations for the interface.
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

// Scan password login strings.
export const ScanPasswordLoginFirstSubheader = <FormattedMessage id='scan-login-password-first-subheader' defaultMessage='scan-login-password-first-subheader' />;
export const ScanPasswordLoginSecondSubheader = <FormattedMessage id='scan-login-password-second-subheader' defaultMessage='scan-login-password-second-subheader' />;
export const ScanPasswordLoginFirstHelpboxText = <FormattedMessage id='scan-login-password-usename-help-box-text' defaultMessage='scan-login-password-usename-help-box-text' />;
export const ScanPasswordLoginSecondHelpboxText = <FormattedMessage id='scan-login-password-password-help-box-text' defaultMessage='scan-login-password-password-help-box-text' />;
export const ScanPasswordLoginInputLabel = <FormattedMessage id='scan-login-password-input-label' defaultMessage='scan-login-password-input-label' />;
export const ScanPasswordLoginHeader = <FormattedMessage id='scan-login-password-header' defaultMessage='scan-login-password-header' />;

// Check in items strings.
export const CheckInItemsOkButton = <FormattedMessage id='check-in-items-ok-button' defaultMessage='check-in-items-ok-button' />;
export const CheckInItemsDeleteButton = <FormattedMessage id='check-in-items-delete-button' defaultMessage='check-in-items-delete-button' />;
export const CheckInItemsHelpBoxText = <FormattedMessage id='check-in-items-help-box-text' defaultMessage='check-in-items-help-box-text' />;
export const CheckInItemsInputLabel = <FormattedMessage id='check-in-items-input-label' defaultMessage='check-in-items-input-label' />;
export const CheckInItemsHeader = <FormattedMessage id='check-in-items-header' defaultMessage='check-in-items-header' />;
export const CheckInItemsSubheader = <FormattedMessage id='check-in-items-subheader' defaultMessage='check-in-items-subheader' />;

// Check out items strings.
export const CheckOutItemsOkButton = <FormattedMessage id='check-out-items-ok-button' defaultMessage='check-out-items-ok-button' />;
export const CheckOutItemsDeleteButton = <FormattedMessage id='check-out-items-delete-button' defaultMessage='check-out-items-delete-button' />;
export const CheckOutItemsHelpBoxText = <FormattedMessage id='check-out-items-help-box-text' defaultMessage='check-out-items-help-box-text' />;
export const CheckOutItemsInputLabel = <FormattedMessage id='check-out-items-input-label' defaultMessage='check-out-items-input-label' />;
export const CheckOutItemsHeader = <FormattedMessage id='check-out-items-header' defaultMessage='check-out-items-header' />;
export const CheckOutItemsSubheader = <FormattedMessage id='check-out-items-subheader' defaultMessage='check-out-items-subheader' />;

// Status strings.
export const StatusHeader = <FormattedMessage id='status-header' defaultMessage='status-header' />;
export const StatusHeaderPrint = <FormattedMessage id='status-header-print' defaultMessage='status-header-print' />;
export const StatusSubheader = <FormattedMessage id='status-subheader' defaultMessage='status-subheader' />;
export const StatusHeaderCurrentLoans = <FormattedMessage id='status-header-current-loans' defaultMessage='status-header-current-loans' />;
export const StatusHeaderReservations = <FormattedMessage id='status-header-reservations' defaultMessage='status-header-reservations' />;
export const StatusHeaderReadyForPickup = <FormattedMessage id='status-header-ready-for-pickup' defaultMessage='status-header-ready-for-pickup' />;
export const StatusBannerHeaderFinedBook = <FormattedMessage id='banner-header-book-with-fine' defaultMessage='banner-header-book-with-fine' />;
export const StatusUnavailable = <FormattedMessage id='status-unavailable' defaultMessage='status-unavailable' />;
export const StatusButtonPrint = <FormattedMessage id='button-status-print' defaultMessage='button-status-print' />;

/**
 * Create HeaderOverdueBooks translation.
 * @param numberOfBooks
 * @returns {JSX.Element}
 * @constructor
 */
export function StatusBannerHeaderOverdueBooks(numberOfBooks) {
    return <FormattedMessage id="banner-header-books-for-check-in" defaultMessage="banner-header-books-for-check-in" values={{ numberOfBooks: numberOfBooks }} />;
}

// Help box strings.
export const HelpBoxHeader = <FormattedMessage id='help-box-header' defaultMessage='help-box-header' />;

// Input strings.
export const InputBookIsRegistered = <FormattedMessage id='book-is-registered' defaultMessage='book-is-registered' />;

// Scan Login strings
export const ScanLoginHelpboxText = <FormattedMessage id='scan-login-help-box-text' defaultMessage='scan-login-help-box-text' />;
export const ScanLoginHeader = <FormattedMessage id='scan-login-header' defaultMessage='scan-login-header' />;
export const ScanLoginSubheader = <FormattedMessage id='scan-login-subheader' defaultMessage='scan-login-subheader' />;

// Login strings
export const LoginLoginNotConfigured = <FormattedMessage id='login-not-configured' defaultMessage='login-not-configured' />;
export const LoginLoginError = <FormattedMessage id='login-error' defaultMessage='login-error' />;

// Navbar strings
export const NavbarButtonCheckOut = <FormattedMessage id='button-navbar-check-out' defaultMessage='button-navbar-check-out' />;
export const NavbarButtonStatus = <FormattedMessage id='button-navbar-status' defaultMessage='button-navbar-status' />;
export const NavbarButtonCheckIn = <FormattedMessage id='button-navbar-check-in' defaultMessage='button-navbar-check-in' />;
export const NavbarButtonFinish = <FormattedMessage id='button-navbar-finish' defaultMessage='button-navbar-finish' />;
export const NavbarButtonLoginMethod = <FormattedMessage id='button-navbar-login-method' defaultMessage='button-navbar-login-method' />;
export const NavbarStopLoginSession = <FormattedMessage id='navbar-stop-login-session' defaultMessage='navbar-stop-login-session' />;
export const NavbarStartLoginSession = <FormattedMessage id='navbar-start-login-session' defaultMessage='navbar-start-login-session' />;

// Initial strings
export const InitialButtonCheckOut = <FormattedMessage id='initial-button-check-out' defaultMessage='initial-button-check-out' />;
export const InitialButtonStatus = <FormattedMessage id='initial-button-status' defaultMessage='initial-button-status' />;
export const InitialButtonCheckIn = <FormattedMessage id='initial-button-check-in' defaultMessage='initial-button-check-in' />;
export const InitialHeader = <FormattedMessage id='initial-choose-a-function' defaultMessage='initial-choose-a-function' />;

// Banner adapter strings
export const BannerAdapterFetchingInfo = <FormattedMessage id='banner-adapter-fetching-info' defaultMessage='banner-adapter-fetching-info' />;
/**
 * Returns a string with title and author.
 * @param {string} title The title.
 * @param {string} author The author.
 */
export function BannerTitleAuthor(title, author) {
    return <FormattedMessage id="banner-title-author" defaultMessage="banner-title-author" values={{ title: title, author: author }} />;
}

// App strings
export const AppTokenNotValid = <FormattedMessage id='app-token-not-valid' defaultMessage='app-token-not-valid' />;
export const ServerError = <FormattedMessage id='app-server-error' defaultMessage='app-server-error' />;

// Print strings
export const PrintReservationNote = <FormattedMessage id='print-reservation-note' defaultMessage='print-reservation-note' />;

// Book banner
/**
 * Return a string of "by author".
 * @param author
 * @returns {JSX.Element}
 * @constructor
 */
export function BookBannerByAuthor(author) {
    return <FormattedMessage id="book-banner-by-author" defaultMessage="book-banner-by-author" values={{ author: author }} />;
}
export const BookBannerWithoutAuthor = <FormattedMessage id='book-banner-without-author' defaultMessage='book-banner-without-author' />;

// change-login-method.js
export const ChangeLoginMethodScanUsername = <FormattedMessage id='change-login-method-scan-username' defaultMessage='change-login-method-scan-username' />;
export const ChangeLoginMethodScanUsernameAndPassword = <FormattedMessage id='change-login-method-scan-username-and-password' defaultMessage='change-login-method-scan-username-and-password' />;
export const ChangeLoginMethodPickLoginMethodHeader = <FormattedMessage id='change-login-method-pick-login-method-header' defaultMessage='change-login-method-pick-login-method-header' />;
export const ChangeLoginMethodHelpBoxHeader = <FormattedMessage id='change-login-method-help-box-header' defaultMessage='change-login-method-help-box-header' />;
/**
 * Create ChangeLoginMethodTimeoutMessage translation.
 * @param seconds
 * @returns {JSX.Element}
 * @constructor
 */
export function ChangeLoginMethodTimeoutMessage(seconds) {
    const minutesForMessage = Math.floor(seconds / 60);
    const secondsForMessage = seconds - minutesForMessage * 60;
    return <FormattedMessage id="change-login-method-timeout-message" defaultMessage="change-login-method-timeout-message" values={{ seconds: secondsForMessage, minutes: minutesForMessage, br: <br /> }} />;
}
