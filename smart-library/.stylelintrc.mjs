const lowerCamelCase = "^[a-z][a-zA-Z0-9]+$";

/**
 * @type {import("stylelint").Config}
 */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "custom-media-pattern": [
      lowerCamelCase,
      {
        message: (name) =>
          `Expected custom media query name "${name}" to be lowerCamelCase`,
      },
    ],
    "custom-property-pattern": [
      lowerCamelCase,
      {
        message: (name) =>
          `Expected custom property name "${name}" to be lowerCamelCase`,
      },
    ],
    "keyframes-name-pattern": [
      lowerCamelCase,
      {
        message: (name) =>
          `Expected keyframe name "${name}" to be lowerCamelCase`,
      },
    ],
    "selector-class-pattern": [
      lowerCamelCase,
      {
        message: (selector) =>
          `Expected class selector "${selector}" to be lowerCamelCase`,
      },
    ],
    "selector-id-pattern": [
      lowerCamelCase,
      {
        message: (selector) =>
          `Expected id selector "${selector}" to be lowerCamelCase`,
      },
    ],
  },
};
