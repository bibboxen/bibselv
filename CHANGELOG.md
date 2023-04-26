# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2023-04-26

- Removed auto deploy to staging.
- Re-written tests in cypress.
- Added clock to main screen.

## [1.0.8] - 2023-02-02

- Downgraded setup from PHP 8.1 to 8.0 to match server

## [1.0.7] - 2023-02-02

- Update composer packages, CVE-2022-24894, CVE-2022-24895

## [1.0.6] - 2023-01-18

- Fixed missing getUserIdentifier() function in User entity
- Added missing npm install in retsart script

## [1.0.5] - 2023-01-18

- Fixed exception handling for Azure errors
- Removed phpcs
- Updated composer packages

## [1.0.4] - 2022-08-16

- Removed decimals from minutes. Changed layout of text box
- Changed login method page (???)
- Removed unused formatted messages
- Removed help box
- Added logging and error page for failed azure ad logins
- Updated Symfony with dependencies
- Reset button on all pages
- Change login method page updates
- Change error sound
- Remove "snydeknap"

## [1.0.3] - 2022-04-28

### Changed

- BIBSELV-250: Changed translation

## [1.0.2] - 2022-03-29

### Changed

- SUPPORT-443: Removed input field

## [1.0.1] - 2022-03-25

### Changed

- SUPPORT-443: Made barcode timeout configurable

## [1.0.0] - 2022-03-01

### Added

- Initial release
