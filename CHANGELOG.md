# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.3] - 2019-12-09
### Changed
- Made function names more descriptive.
- `extension.insertRandomLink` now inserts link at cursor position rather than at the beginning of the active file.
- Removed duplicate code by fetching random links using a function.

### Added
- New command - `extension.renderImageById`.
- Added error message on link fetch fail.

### Fixed
- Removed link fetch without user interaction on startup.

## [0.0.2] - 2019-11-09
### Fixed
- Image link was fetched on Promise execution, they now get fetched on command executions instead.

## [0.0.1] - 2019-11-09
### Added
- New command - `extension.insertRandomLink`.
- New command - `extension.renderRandomImage`.
