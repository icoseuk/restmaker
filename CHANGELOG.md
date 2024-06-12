# Changelog

## [1.1.0] - 2024-06-12

This release includes a major change in how the library is imported and used.

### Added

- Wrote code documentation on client methods.

### Changed

- Changed library type imports to use named imports instead of default imports.
- The entire bundle size is now just about 30KB, with types included.

## [1.0.2] - 2024-06-12

This release includes an update to how session validation is handled.

### Changed

- The FileMaker Data API session is now validated before each request. **Note:** This change raises the minimum required FileMaker Server version to 19 or later.

## [1.0.1] - 2024-05-27

This release includes a hot fix for the `package.json` index references.

### Fixed

- Corrected `package.json` index references.

## [1.0.0] - 2024-05-27

Introducing the first release of RestMaker! 🎉

### Added

- Implemented basic CRUD operations for working with FileMaker layout records.
- Added support for authentication using FileMaker Data API credentials.
- Included comprehensive documentation and usage examples.
