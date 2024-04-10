//import styleGuide from "eslint-config-standard";
import js from "@eslint/js"

// eslint-disable-next-line import/no-anonymous-default-export
export default [
//  ...[].concat(styleGuide),
  js.configs.recommended,
  {
    rules: {
      "no-duplicate-imports": "warn",
      "no-use-before-define": "warn",
      "consistent-return": "warn",
      "no-undefined": "warn",
      "no-var": "warn",
      "require-await": "warn",
      "sort-imports": "warn",
      "sort-vars": "warn"
    }
  }
];