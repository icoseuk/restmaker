# Changelog

## [1.4.0] - 2024-06-17

This release includes a profiling mode.

### Added

- Added a new `enableProfiling` flag to the client constructor to enable profiling mode.

### Fixed

- Minor type corrections on tests.

## [1.3.1] - 2024-06-13

This release includes another small fix on types.

### Fixed

- Methods now include the correct return types for portals.
- The `find` method now correctly casts all query values to strings.

## [1.3.0] - 2024-06-13

This release includes a fix on portal types and a new exception type.

### Added

- Added a new `FileMakerDataAPIHTTPException` exception type.
- Added a new `FileMakerDataAPIOperationException` exception type.

### Fixed

- Generic method types that utilise portals are now correctly typed.

## [1.2.2] - 2024-06-12

This release includes a fix regarding retrieving protals.

### Fixed

- Portal offsets and limits are now optional.

## [1.2.1] - 2024-06-12

This release includes the ability to set an `offset` during finds.

### Added

- Added support for `offset` during finds.

### Fixed

- Find query types are now correctly typed.

## [1.2.0] - 2024-06-12

This release includes small DX improvements and a bug fix.

### Added

- Added support for `http` and `https` protocols in the client hostname.

### Fixed

- Added explicit export for the `FileMakerDataAPIRecord` type.

## [1.1.1] - 2024-06-12

This release includes an important fix to type definitions, and CI/CD improvements.

### Fixed

- Added explicit exports to type definitions to fix import issues.

### Changed

- Improved CI/CD pipeline to include code coverage testing.

## [1.1.0] - 2024-06-12

This release includes a major change in how the library is imported and used.

### Added

- Wrote code documentation on client methods.

### Changed

- Bundled library type definitions in a single file.
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
