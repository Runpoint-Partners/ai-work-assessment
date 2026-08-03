# Releasing the assessment

The Overflow website repository is upstream for the current assessment contract. This repository packages that contract for public use.

## Version rules

- The assessment prompt version changes when the method or required output changes.
- The profile schema version changes when the JSON shape or validation contract changes.
- The helper uses semantic versioning. Its major version matches the current assessment prompt.
- The evidence-bundle schema is independent. Change it only when old bundles cannot be read safely.

## Release sequence

1. Finish the prompt, schema, validator, renderer, template, website copy, and fictional sample in `../overflow-atx`.
2. Run the complete website test suite and build its sample page.
3. Run `npm run sync` here. Do not hand-edit generated files listed in `SYNC-MANIFEST.json`.
4. Update `package.json`, `README.md`, `CHANGELOG.md`, CLI messages, and compatibility tests.
5. Run `npm run release:check`. This checks vendored hashes, both test suites, the version contract, the current sample, and byte-for-byte prompt equality with upstream.
6. Run one fresh personal assessment with the current prompt. Validate and render the JSON with this helper. Inspect desktop and phone layouts. Keep the result private until the owner approves an upload.
7. Commit and push this repository. Create and push the exact helper tag from `assessment-contract.json`.
8. Commit and publish the website after the helper tag exists.
9. Verify the hosted assessment page, prompt, template, renderer, and fictional sample from the public domain.

The detailed upstream checklist is in `../overflow-atx/docs/assessment-release-process.md`.
