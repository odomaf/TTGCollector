"use strict";

module.exports = {
  types: [
    { value: "feat", name: "feat:      A new feature" },
    { value: "fix", name: "fix:       A bug fix" },
    {
      value: "refactor",
      name: "refactor:  Code change that is not a fix or feature",
    },
    {
      value: "style",
      name: "style:     CSS / visual changes, no logic impact",
    },
    { value: "docs", name: "docs:      Documentation only" },
    { value: "test", name: "test:      Adding or updating tests" },
    { value: "chore", name: "chore:     Build process, tooling, dependencies" },
  ],

  scopes: [
    { name: "api" },
    { name: "add-game" },
    { name: "bgg" },
    { name: "db" },
    { name: "modal" },
    { name: "models" },
    { name: "search" },
    { name: "tooling" },
    { name: "ui" },
  ],

  messages: {
    type: "Select the type of change:",
    scope: "Select the scope (area of the codebase):",
    subject: "Short description (imperative, no period at end):\n",
    body: "Longer description (optional, press enter to skip):\n",
    confirmCommit: "Confirm commit with message above?",
  },

  allowCustomScopes: false,
  allowBreakingChanges: ["feat", "fix"],
  skipQuestions: ["footer"],
  subjectLimit: 72,
};
