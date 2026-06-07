# Upgrade Plan: campus-connect (20260607141435)

- **Generated**: 2026-06-07 14:50:00
- **HEAD Branch**: appmod/java-upgrade-20260607141435
- **HEAD Commit ID**: N/A

## Available Tools

**JDKs**
- JDK 21.0.10: C:\Program Files\Java\jdk-21\bin
- JDK 21.0.11: C:\Users\Keerthiga T S\.jdks\temurin-21.0.11\bin

**Build Tools**
- Maven: **<TO_BE_INSTALLED>** (required by Step 1)
- Maven Wrapper: not present

## Guidelines

> Note: You can add any specific guidelines or constraints for the upgrade process here if needed, bullet points are preferred.

## Options

- Working branch: appmod/java-upgrade-20260607141435
- Run tests before and after the upgrade: true

## Upgrade Goals

- Upgrade Java runtime from 17 to 21

## Technology Stack

| Technology/Dependency | Current | Min Compatible | Why Incompatible |
| --------------------- | ------- | -------------- | ---------------- |
| Java | 17 | 21 | User requested latest LTS runtime upgrade |
| Spring Boot | 3.2.5 | 3.2.5 | Current Spring Boot 3.2.5 already supports Java 21 |
| Maven | none installed | 3.9.15 | Build tool required for Maven project compilation and tests |
| Spring Boot Maven Plugin | managed by parent | 3.2.x managed | Compatible with Java 21 and Spring Boot 3.2.x |

## Derived Upgrades

- Java 21 → install Maven 3.9.15+ to build the project in the target environment.
- Java 21 → update `backend/pom.xml` `<java.version>` from `17` to `21`.

## Impact Analysis

### Dependency Changes

| File | Dependency | Current | Action | Target | Reason |
|------|-----------|---------|--------|--------|--------|
| backend/pom.xml | `<java.version>` | 17 | upgrade | 21 | Set Maven compiler target to Java 21 |

### Source Code Changes

| File | Location | Current | Required Change | Reason |
|------|----------|---------|----------------|--------|
| N/A | N/A | N/A | No source code changes required for this JVM-only upgrade | Current code already targets Spring Boot 3.x and Jakarta APIs |

### Configuration Changes

| File | Property/Setting | Current | Required Change | Reason |
|------|------------------|---------|-----------------|--------|
| backend/pom.xml | `java.version` | 17 | 21 | Align Maven compile target with Java 21 |

### CI/CD Changes

| File | Location | Current | Required Change |
|------|----------|---------|-----------------|
| N/A | N/A | N/A | No CI/CD files detected or modified in this phase |

### Risks & Warnings

- **No Maven installation present**: The workspace has no Maven runtime available. **Mitigation**: Install Maven 3.9.15+ in Step 1 and verify with `mvn -version`.
- **No base JDK 17 available for baseline**: The system has only Java 21 installed. **Mitigation**: Skip baseline step and document that the current-project baseline cannot be verified locally against Java 17.
- **Untracked repo state**: The workspace contains many untracked files and no existing commit history. **Mitigation**: Work in the created branch and document that repository history is unavailable for this upgrade.

## Upgrade Steps

- Step 1: Setup Environment
  - **Rationale**: Ensure the required JDK and build tool are available before making source changes.
  - **Changes to Make**: Install Maven 3.9.15+ and confirm Java 21 availability.
  - **Verification**: `mvn -version` using installed Maven, `java -version` using JDK 21.

- Step 2: Setup Baseline
  - **Rationale**: Capture current project state and test baseline if the current JDK is available.
  - **Changes to Make**: Skip baseline because Java 17 is not available locally.
  - **Verification**: Skipped due to missing base JDK 17.

- Step 3: Upgrade Java Version in Maven Build
  - **Rationale**: Apply the runtime upgrade to Java 21 in the build configuration.
  - **Changes to Make**: Update `backend/pom.xml` property `<java.version>` from `17` to `21`.
  - **Verification**: `mvn -f backend/pom.xml clean test-compile -q` with Java 21.

- Step 4: CVE Validation & Fix
  - **Rationale**: Confirm direct Maven dependencies are not vulnerable after the runtime upgrade.
  - **Changes to Make**: Scan direct dependencies and patch any reported CVEs by updating dependency versions.
  - **Verification**: `mvn -f backend/pom.xml clean test-compile -q`, rerun CVE scan, ensure no remaining reported CVEs.

- Step 5: Final Validation
  - **Rationale**: Verify the completed upgrade compiles and all tests pass on Java 21.
  - **Changes to Make**: Fix any compiler or test failures discovered after runtime upgrade.
  - **Verification**: `mvn -f backend/pom.xml clean test -q` with Java 21.
