import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, useDefaults: true });
addFormats(ajv);

export function validateExtensionManifest(extensionData) {
  const schema = {
    type: "object",
    properties: {
      name: { type: "string", minLength: 1 },
      description: { type: "string", minLength: 1 },
      icon: { type: "string" },
      categories: {
        type: "array",
        items: { type: "string" },
        minItems: 1,
      },
      version: { type: "string", pattern: "^\\d+\\.\\d+\\.\\d+$" },
      type: {
        type: "string",
        enum: ["swift", "javascript", "typescript"],
      },
      author: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          email: { type: "string", format: "email" },
          company: { type: "string" },
        },
        required: ["name"],
        additionalProperties: false,
      },
      license: { type: "string", minLength: 1 },
      editor: {
        type: "array",
        items: { type: "string", pattern: "^\\d+\\.\\d+\\.\\d+$" },
        minItems: 1,
      },
    },
    required: [
      "name",
      "description",
      "icon",
      "categories",
      "version",
      "type",
      "author",
      "license",
      "editor",
    ],
    additionalProperties: true,
  };

  const validate = ajv.compile(schema);
  const valid = validate(extensionData);

  if (!valid) {
    const errors = validate.errors
      .map((err) => `${err.instancePath} ${err.message}`)
      .join(", ");
    throw new Error(errors);
  }
}
