# Changelog

All notable changes to this project will be documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
We follow the format used by [Open Telemetry](https://github.com/open-telemetry/opentelemetry-python/blob/main/CHANGELOG.md).

#### Version 2.1.0 (2023-09-04)

##### Build System / Dependencies

* **deps:**  bump aws-actions/configure-aws-credentials from 2 to 3 ([17e1f53b](https://github.com/Topsort/building-blocks/commit/17e1f53bd551f2e080ff756080ed20a10e678c74))
* **deps-dev:**
  *  bump the lint group with 3 updates ([236d11de](https://github.com/Topsort/building-blocks/commit/236d11debc1e928bb848e892db1f5ee05ba16a8e))
  *  bump typescript from 5.1.6 to 5.2.2 ([95b9c445](https://github.com/Topsort/building-blocks/commit/95b9c4454173dab58b374a31b7a1c70926b05c95))

##### Chores

*  switch user-agent key ([d528d2af](https://github.com/Topsort/building-blocks/commit/d528d2afd91b062230e6e45f1f8406df4c754dd8))

##### New Features

*  create chart component ([#162](https://github.com/Topsort/building-blocks/pull/162)) ([ea32f4bf](https://github.com/Topsort/building-blocks/commit/ea32f4bf9e4d792adca08a00d4b4e226e11a53c7))
*  date dropdown component ([#158](https://github.com/Topsort/building-blocks/pull/158)) ([223fc198](https://github.com/Topsort/building-blocks/commit/223fc198feba1115edf035b134c15d5781e8d818))

##### Bug Fixes

*  switch to npm for publishing ([44f34c36](https://github.com/Topsort/building-blocks/commit/44f34c3601f7e544fad625533c5673c8d2b39140))

##### Other Changes

*  switch to npm for publishing ([deaccd91](https://github.com/Topsort/building-blocks/commit/deaccd91a6238e679d62718d36bf599dacfe9865))

## Version 2.1.0-beta2 (2023-08-22)

### Added
- Added dropdown component (#153)
  ![image](https://github.com/Topsort/building-blocks/assets/95320456/2756830b-01fb-4ff6-a70b-0d91495e8243)

### Changed
- Updated reporting path in central services (#154)
- Improved HTML for better validation (#152)

### Fixed
- Fixed path to types and requests (#151)

### Chore
- Added badges to README (#149)
- Used environment variables instead of hardcoded values (#143)
- Added `CODEOWNERS` file for code ownership (#147)
- Updated dependencies: bumped `preact` from 10.17.0 to 10.17.1 (#146)
- Updated dependencies: bumped `zod` from 3.22.1 to 3.22.2 (#145)

## Version 2.1.0-beta1 (2023-08-03)

### Changed
- feat: Promote my Shop button. Add a new button that can create a campaign using the whole catalog of the vendor.
  * Create campaign
  * Obtain campaign
  * Update campaign
