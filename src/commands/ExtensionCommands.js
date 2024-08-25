import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import { validateExtensionManifest } from "../utils/extensionManifest.js";
import { isMacOS } from "../utils/osUtils.js";
import withErrorHandling from "../utils/errorHandler.js";
import { getAuthorInfo } from "../utils/authorUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Class for handling extension-related commands
class ExtensionCommands {
  /**
   * Creates a new extension by prompting the user for details, validating the manifest, and setting up the project directory.
   * @returns {Promise<void>}
   */
  static createExtension = withErrorHandling(async () => {
      // Define possible categories and editor versions
      const categories = [
        "Programming Languages",
        "Snippets",
        "Linters",
        "Themes",
        "Debuggers",
        "Formatters",
        "Keymaps",
        "SCM Providers",
        "Other",
        "Extension Packs",
        "Language Packs",
        "Data Science",
        "Machine Learning",
        "Visualization",
        "Notebooks",
        "Education",
        "Testing",
      ];
      const editorVersions = ["1.0.0", "1.1.0", "1.2.0"];

      // Fetch author information from the system
      const authorInfo = await getAuthorInfo();

      // Prompt the user for extension details
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "type",
          message: "Choose the language for the extension:",
          choices: ["swift", "javascript", "typescript"],
        },
        {
          type: "input",
          name: "name",
          message: "Enter the name of the extension:",
          validate: (input) => !!input || "Extension name is required.",
        },
        {
          type: "input",
          name: "description",
          message: "Enter a short description of the extension:",
          validate: (input) => !!input || "Description is required.",
        },
        {
          type: "checkbox",
          name: "categories",
          message: "Select the categories the extension falls into:",
          choices: categories,
          validate: (input) =>
            input.length > 0 || "At least one category must be selected.",
        },
        {
          type: "input",
          name: "license",
          message: "Enter the license type:",
          default: "MIT",
          validate: (input) => !!input || "License is required.",
        },
        {
          type: "checkbox",
          name: "editorVersion",
          message: "Select the supported editor versions:",
          choices: editorVersions,
          validate: (input) =>
            input.length > 0 || "At least one editor version must be selected.",
        },
        {
          type: "confirm",
          name: "gitSupport",
          message: "Do you want to initialize a Git repository?",
          default: true,
        },
      ]);

      // Prepare the extension data object from the user inputs
      const extensionData = {
        name: answers.name,
        description: answers.description,
        icon: "",
        categories: answers.categories,
        version: "0.0.1",
        type: answers.type,
        author: {
          name: authorInfo.name,
          email: authorInfo.email || "",
          company: authorInfo.company || "",
        },
        license: answers.license,
        editor: answers.editorVersion,
        homepage: answers.homepage,
      };

      // Validate the extension manifest data
      try {
        validateExtensionManifest(extensionData);
        console.log(chalk.green("Extension manifest is valid."));
      } catch (error) {
        console.error(chalk.red(`Validation failed: ${error.message}`));
        return;
      }

      // Determine the destination path for the new extension
      const dest = path.join(process.cwd(), answers.name);

      // Check if the directory already exists to avoid overwriting
      if (await fs.pathExists(dest)) {
        console.log(
          chalk.red(
            `Directory "${answers.name}" already exists in the current path.`
          )
        );
        return;
      }

      // Create the directory for the extension
      await fs.mkdirp(dest);

      // Write the extension manifest file (extension.json)
      await fs.writeJSON(path.join(dest, "extension.json"), extensionData, {
        spaces: 2,
      });
      console.log(chalk.green("extension.json file created successfully."));

      // Copy template files based on the selected language
      const templatePath = path.join(
        __dirname,
        "..",
        "..",
        "templates",
        answers.type.toLowerCase()
      );

      console.log(templatePath);

      // Check if the template path exists before copying
      if (await fs.pathExists(templatePath)) {
        await fs.copy(templatePath, dest);
        console.log(
          chalk.green(`Template for ${answers.type} copied successfully.`)
        );
      } else {
        console.log(chalk.red(`Template for ${answers.type} not found.`));
      }

      // Optionally initialize a Git repository if the user opted in
      if (answers.gitSupport) {
        await this.initializeGitRepository(dest);
      }

      // Final success message
      console.log(
        chalk.green(
          `Extension "${answers.name}" created successfully at ${dest}.`
        )
      );
    });

  /**
   * Lists all created extensions by reading the extensions directory.
   * This function is wrapped with error handling to manage potential errors gracefully.
   */
  static listExtensions = withErrorHandling(() => {
    const extensionsDir = path.join(process.cwd(), "extensions");

    // Check if the extensions directory exists
    if (!fs.existsSync(extensionsDir)) {
      console.log(chalk.red("No extensions directory found."));
      return;
    }

    // Read the directory contents
    const extensions = fs.readdirSync(extensionsDir);

    // Provide feedback based on the presence of extensions
    if (extensions.length === 0) {
      console.log(chalk.yellow("No extensions found."));
    } else {
      console.log(chalk.green("Created extensions:"));
      extensions.forEach((ext, index) => {
        console.log(`${index + 1}. ${ext}`);
      });
    }
  });

  /**
   * Placeholder function for uploading an extension.
   * This function is wrapped with error handling to manage potential errors gracefully.
   */
  static uploadExtension = withErrorHandling(() => {
    console.log(chalk.green("Uploading extension..."));
    // Implement your upload logic here
  });

  /**
   * Placeholder function for updating an extension by ID.
   * This function is wrapped with error handling to manage potential errors gracefully.
   * @param {string} extensionId - The unique identifier of the extension to update.
   */
  static updateExtension = withErrorHandling((extensionId) => {
    console.log(chalk.green(`Updating extension with ID: ${extensionId}`));
    // Implement your update logic here
  });

  /**
   * Removes an extension by its ID.
   * This function is wrapped with error handling to manage potential errors gracefully.
   * @param {string} extensionId - The unique identifier of the extension to remove.
   */
  static removeExtension = withErrorHandling((extensionId) => {
    const extensionsDir = path.join(process.cwd(), "extensions");
    const extensionPath = path.join(extensionsDir, extensionId);

    // Check if the specified extension exists before attempting removal
    if (!fs.existsSync(extensionPath)) {
      console.log(
        chalk.red(`Extension with ID ${extensionId} does not exist.`)
      );
      return;
    }

    // Remove the extension directory and its contents
    fs.removeSync(extensionPath);
    console.log(
      chalk.green(`Extension with ID ${extensionId} has been removed.`)
    );
  });

  /**
   * Placeholder function for deprecating an extension by ID.
   * This function is wrapped with error handling to manage potential errors gracefully.
   * @param {string} extensionId - The unique identifier of the extension to deprecate.
   */
  static deprecateExtension = withErrorHandling((extensionId) => {
    console.log(chalk.yellow(`Deprecating extension with ID: ${extensionId}`));
    // Implement your deprecation logic here
  });

  /**
   * Installs the extension from the current directory.
   * This function only supports macOS and validates the extension manifest before installation.
   */
  static installExtension = withErrorHandling(() => {
    // Check if the OS is macOS
    if (!isMacOS()) {
      console.log(chalk.red("The install command is only supported on macOS."));
      return;
    }

    const currentDir = process.cwd();
    const extensionJsonPath = path.join(currentDir, "extension.json");

    // Check if the extension manifest exists in the current directory
    if (!fs.existsSync(extensionJsonPath)) {
      console.log(
        chalk.red("extension.json file not found in the current directory.")
      );
      return;
    }

    let extensionData;
    try {
      // Read and validate the extension manifest
      extensionData = fs.readJsonSync(extensionJsonPath);
      validateExtensionManifest(extensionData); // Validate using the helper
    } catch (err) {
      console.log(
        chalk.red(`Error reading or validating extension.json: ${err.message}`)
      );
      return;
    }

    // Determine the file extension based on the language
    const fileExtension =
      extensionData.language === "swift" ? "AEext" : "JSext";
    const installPath = path.join(
      os.homedir(),
      "Library",
      "Application Support",
      "com.auroraeditor",
      "Extensions",
      `${extensionData.name}.${fileExtension}`
    );

    // Create the necessary directories and copy the extension files
    fs.mkdirSync(path.dirname(installPath), { recursive: true });
    fs.copySync(currentDir, installPath);

    // Confirm successful installation
    console.log(
      chalk.green(
        `Extension "${extensionData.name}" installed successfully to ${installPath}.`
      )
    );
  });

  /**
   * Initializes a Git repository in the specified directory.
   * @param {string} directory - The path of the directory where Git should be initialized.
   * @returns {Promise<void>}
   */
  static async initializeGitRepository(directory) {
    const { execa } = await import("execa");

    try {
      // Initialize the Git repository in the provided directory
      await execa("git", ["init"], { cwd: directory });
      console.log(
        chalk.green("Git repository initialized successfully in the directory.")
      );
    } catch (error) {
      // Handle errors related to Git initialization
      console.error(
        chalk.red("Failed to initialize Git repository:", error.message)
      );
    }
  }
}

export default ExtensionCommands;
