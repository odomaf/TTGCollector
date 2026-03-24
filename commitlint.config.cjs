module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "style", "docs", "test", "chore"],
    ],
    "scope-enum": [
      2,
      "always",
      [
        "tooling",
        "api",
        "bgg",
        "add-game",
        "models",
        "db",
        "ui",
        "modal",
        "search",
      ],
    ],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 72],
  },
};
