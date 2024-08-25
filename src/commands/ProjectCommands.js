import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import withErrorHandling from "../utils/errorHandler.js";
import { isMacOS } from "../utils/osUtils.js";

// The ProjectCommands class provides commands to manage projects, including creation, opening, and deletion.
class ProjectCommands {
  /**
   * Creates a new project by prompting the user for project details, setting up the project structure, and initializing the project based on the selected type.
   * This command is only supported on macOS.
   */
  static createProject = withErrorHandling(async () => {
    // Check if the operating system is macOS
    if (!isMacOS()) {
      console.log(
        chalk.red("The create project command is only supported on macOS.")
      );
      return;
    }

    // Prompt the user for project details such as name, type, and directory
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Enter the project name:",
        validate: (input) => (input ? true : "Project name cannot be empty."),
      },
      {
        type: "list",
        name: "projectType",
        message: "Select the project type:",
        choices: ["Node", "Swift", "TypeScript", "JavaScript"],
      },
      {
        type: "input",
        name: "directory",
        message: "Enter the directory where the project should be created:",
        default: process.cwd(), // Use the current working directory as the default
        validate: (input) => (input ? true : "Directory path cannot be empty."),
      },
    ]);

    const { projectName, projectType, directory } = answers;
    const projectPath = path.join(directory, projectName);

    // Check if a directory with the project name already exists
    if (fs.existsSync(projectPath)) {
      console.log(
        chalk.red(
          `A directory named "${projectName}" already exists in the specified location.`
        )
      );
      return;
    }

    // Create the project directory
    fs.mkdirSync(projectPath, { recursive: true });
    console.log(
      chalk.green(
        `Creating ${projectType} project "${projectName}" in ${directory}...`
      )
    );

    // Initialize the project based on the selected project type
    switch (projectType) {
      case "Node":
        await this.initializeNodeProject(projectPath);
        break;
      case "Swift":
        await this.initializeSwiftProject(projectPath);
        break;
      case "TypeScript":
        await this.initializeTypeScriptProject(projectPath);
        break;
      case "JavaScript":
        await this.initializeJavaScriptProject(projectPath);
        break;
      default:
        console.log(chalk.red("Unsupported project type."));
        fs.rmdirSync(projectPath); // Remove the created directory if the project type is unsupported
        return;
    }

    // Confirm successful project creation and open the project in Aurora Editor
    console.log(
      chalk.green(
        `Project "${projectName}" created successfully at ${projectPath}`
      )
    );
    this.openInEditor("auroraeditor", projectPath);
  });

  /**
   * Opens an existing project in Aurora Editor.
   * This command is only supported on macOS.
   */
  static openProject = withErrorHandling(async () => {
    // Check if the operating system is macOS
    if (!isMacOS()) {
      console.log(
        chalk.red("The open project command is only supported on macOS.")
      );
      return;
    }

    const currentDir = process.cwd(); // Get the current working directory
    const packageJsonPath = path.join(currentDir, "package.json");

    // Check if a package.json file exists in the current directory to identify a project
    if (!fs.existsSync(packageJsonPath)) {
      console.log(chalk.red("No project found in the current directory."));
      return;
    }

    // Open the project in Aurora Editor
    console.log(chalk.green(`Opening project in ${currentDir}`));
    this.openInEditor("auroraeditor", currentDir);
  });

  /**
   * Deletes an existing project by removing the project directory.
   * The user is prompted to confirm the deletion.
   * This command is only supported on macOS.
   */
  static deleteProject = withErrorHandling(async () => {
    // Check if the operating system is macOS
    if (!isMacOS()) {
      console.log(
        chalk.red("The delete project command is only supported on macOS.")
      );
      return;
    }

    // Prompt the user for the project name to delete and confirmation
    const { projectName } = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Enter the project name to delete:",
        validate: (input) => (input ? true : "Project name cannot be empty."),
      },
      {
        type: "confirm",
        name: "confirmDelete",
        message: (answers) =>
          `Are you sure you want to delete the project "${answers.projectName}"?`,
        default: false,
      },
    ]);

    if (!projectName) return;

    const projectPath = path.join(process.cwd(), projectName);

    // Check if the project directory exists before attempting deletion
    if (!fs.existsSync(projectPath)) {
      console.log(chalk.red(`Project "${projectName}" does not exist.`));
      return;
    }

    // Remove the project directory
    fs.removeSync(projectPath);
    console.log(chalk.green(`Project "${projectName}" has been deleted.`));
  });

  /**
   * Initializes a new Node.js project by creating a package.json file and installing dependencies.
   * @param {string} projectPath - The path where the project should be initialized.
   */
  static async initializeNodeProject(projectPath) {
    // Create a basic package.json file
    fs.writeJsonSync(
      path.join(projectPath, "package.json"),
      {
        name: path.basename(projectPath),
        version: "1.0.0",
        main: "index.js",
        scripts: {
          start: "node index.js",
        },
        dependencies: {},
      },
      { spaces: 2 }
    );

    // Create an index.js file with a basic script
    fs.writeFileSync(
      path.join(projectPath, "index.js"),
      `console.log('Hello, ${path.basename(projectPath)}!');\n`
    );

    // Install dependencies
    console.log(chalk.blue("Installing dependencies..."));
    await this.runCommand("npm install", projectPath);
  }

  /**
   * Initializes a new Swift project using the Swift Package Manager.
   * @param {string} projectPath - The path where the project should be initialized.
   */
  static async initializeSwiftProject(projectPath) {
    console.log(chalk.blue("Initializing Swift package..."));
    await this.runCommand("swift package init --type executable", projectPath);
  }

  /**
   * Initializes a new TypeScript project by creating a package.json, tsconfig.json, and installing dependencies.
   * @param {string} projectPath - The path where the project should be initialized.
   */
  static async initializeTypeScriptProject(projectPath) {
    // Create a basic package.json file for the TypeScript project
    fs.writeJsonSync(
      path.join(projectPath, "package.json"),
      {
        name: path.basename(projectPath),
        version: "1.0.0",
        main: "dist/index.js",
        scripts: {
          build: "tsc",
          start: "node dist/index.js",
        },
        dependencies: {},
        devDependencies: {
          typescript: "^4.0.0",
        },
      },
      { spaces: 2 }
    );

    // Create a basic TypeScript file
    fs.writeFileSync(
      path.join(projectPath, "src/index.ts"),
      `console.log('Hello, ${path.basename(projectPath)}!');\n`
    );

    // Create a basic tsconfig.json file
    fs.writeJsonSync(
      path.join(projectPath, "tsconfig.json"),
      {
        compilerOptions: {
          target: "ES6",
          module: "commonjs",
          outDir: "dist",
          rootDir: "src",
          strict: true,
        },
      },
      { spaces: 2 }
    );

    // Install dependencies
    console.log(chalk.blue("Installing dependencies..."));
    await this.runCommand("npm install", projectPath);

    // Build the TypeScript project
    console.log(chalk.blue("Building project..."));
    await this.runCommand("npm run build", projectPath);
  }

  /**
   * Initializes a new JavaScript project by creating a package.json file and installing dependencies.
   * @param {string} projectPath - The path where the project should be initialized.
   */
  static async initializeJavaScriptProject(projectPath) {
    // Create a basic package.json file for the JavaScript project
    fs.writeJsonSync(
      path.join(projectPath, "package.json"),
      {
        name: path.basename(projectPath),
        version: "1.0.0",
        main: "index.js",
        scripts: {
          start: "node index.js",
        },
        dependencies: {},
      },
      { spaces: 2 }
    );

    // Create an index.js file with a basic script
    fs.writeFileSync(
      path.join(projectPath, "index.js"),
      `console.log('Hello, ${path.basename(projectPath)}!');\n`
    );

    // Install dependencies
    console.log(chalk.blue("Installing dependencies..."));
    await this.runCommand("npm install", projectPath);
  }

  /**
   * Opens a project in Aurora Editor.
   * @param {string} command - The command to open the editor (e.g., "auroraeditor").
   * @param {string} projectPath - The path of the project to open.
   */
  static openInEditor(command, projectPath) {
    exec(`${command} "${projectPath}"`, (error) => {
      if (error) {
        console.error(
          chalk.red(`Failed to open project in Aurora Editor: ${error.message}`)
        );
      } else {
        console.log(chalk.green("Project opened in Aurora Editor."));
      }
    });
  }

  /**
   * Runs a shell command in a specified directory.
   * @param {string} command - The command to execute.
   * @param {string} cwd - The directory in which to execute the command.
   * @returns {Promise<void>} - Resolves if the command succeeds, otherwise rejects with an error.
   */
  static runCommand(command, cwd) {
    return new Promise((resolve, reject) => {
      const process = exec(command, { cwd });

      // Handle standard output from the command
      process.stdout.on("data", (data) => console.log(data.toString()));

      // Handle error output from the command
      process.stderr.on("data", (data) => console.error(data.toString()));

      // Handle the exit event of the process
      process.on("exit", (code) => {
        if (code === 0)
          resolve(); // Resolve the promise if the command was successful
        else reject(new Error(`Command "${command}" exited with code ${code}`)); // Reject the promise if the command failed
      });
    });
  }
}

export default ProjectCommands;
