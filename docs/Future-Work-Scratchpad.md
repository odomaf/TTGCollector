(# TTGCollector Future Work)

## Testing and Quality

- Add automated server/API tests with Supertest and a test database strategy.
- Add coverage for authentication: signup, login, session restoration, logout, invalid credentials, validation failures, and duplicate accounts.
- Add coverage for game ownership and collection behavior: unauthenticated requests, adding games, duplicate games, filtering, and user isolation.
- Add coverage for BoardGameGeek integration failures and malformed or incomplete external data.
- Add client tests for the primary collection, authentication, game search, and form workflows.
- Add an end-to-end smoke test for signing in, adding a game, viewing the collection, and logging out.
- Add lint and test commands to CI so deployment is blocked when quality checks fail.
- Replace the production session-secret fallback with fail-fast configuration validation.

## Display Game Details

- Add a game-details view reachable from each game in the collection.
- Display the complete stored game record, including image, description, player range, play time, minimum age, publication year, categories, mechanics, and BoardGameGeek information when available.
- Preserve the current user's collection context and provide a clear path back to the filtered collection.
- Handle missing images, incomplete imported data, deleted games, and unauthorized access with useful messages.
- Add route and component tests for successful display, missing data, nonexistent games, and access control.

## Edit Game Details

- Add an edit action from the game-details view.
- Allow users to update editable game fields and category/mechanic associations.
- Validate required fields, data types, ranges, and text lengths at the API boundary and in the form.
- Restrict edits to games in the current user's collection.
- Preserve relationships and avoid creating duplicate category, mechanic, or collection records.
- Show clear success and error feedback, including database and external-data failures.
- Add API, component, and end-to-end coverage for editing, validation errors, unauthorized edits, and persistence after refresh.

## Suggested Sequence

1. Establish the test database and server test harness.
2. Add authentication and authorization coverage.
3. Add collection and external-integration coverage.
4. Implement and test the game-details view.
5. Implement and test game editing.
6. Add client and end-to-end smoke coverage.
7. Add lint and test checks to the deployment workflow.
