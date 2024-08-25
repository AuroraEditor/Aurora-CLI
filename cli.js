#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ExtensionCommands from "./src/commands/ExtensionCommands.js";
import ProfileCommands from "./src/commands/ProfileCommands.js";
import ProjectCommands from "./src/commands/ProjectCommands.js";

const program = new Command();

// Set up the program's general metadata
program
  .name("aurora")
  .description(
    "Aurora CLI tool for generating extensions and managing profiles"
  )
  .version("1.0.0", "-v, --version", "Output the current version");

// Define the 'extension' command and its subcommands
program
  .command("extension")
  .description("Manage Aurora Editor extensions")
  .option("--create", "Create a new extension")
  .option("--list", "List all extensions")
  .option("--upload", "Upload an extension")
  .option("--update <id>", "Update an extension by ID")
  .option("--remove <id>", "Remove an extension by ID")
  .option("--deprecate <id>", "Deprecate an extension by ID")
  .option("--install", "Install the extension in the current directory")
  .action((cmdObj) => {
    // Handle the subcommands based on the options provided
    if (cmdObj.create) {
      ExtensionCommands.createExtension();
    } else if (cmdObj.list) {
      ExtensionCommands.listExtensions();
    } else if (cmdObj.upload) {
      ExtensionCommands.uploadExtension();
    } else if (cmdObj.update) {
      ExtensionCommands.updateExtension(cmdObj.update);
    } else if (cmdObj.remove) {
      ExtensionCommands.removeExtension(cmdObj.remove);
    } else if (cmdObj.deprecate) {
      ExtensionCommands.deprecateExtension(cmdObj.deprecate);
    } else if (cmdObj.install) {
      ExtensionCommands.installExtension();
    } else {
      console.log(chalk.red("No valid extension command provided."));
    }
  });

// Define the 'profile' command and its subcommands
program
  .command("profile")
  .description("Manage user profiles and Aurora Editor account")
  .option("--create", "Create a new profile")
  .option("--remove", "Remove the existing profile")
  .option("--account <action>", "Manage Aurora account (create, link, unlink)")
  .action((cmdObj) => {
    // Handle the subcommands based on the options provided
    if (cmdObj.create) {
      ProfileCommands.createProfile();
    } else if (cmdObj.remove) {
      ProfileCommands.removeProfile();
    } else if (cmdObj.account) {
      switch (cmdObj.account) {
        case "create":
          ProfileCommands.createAuroraAccount();
          break;
        case "link":
          ProfileCommands.linkAuroraAccount();
          break;
        case "unlink":
          ProfileCommands.unlinkAuroraAccount();
          break;
        default:
          console.log(
            chalk.red(
              "Invalid action for --account. Use 'create', 'link', or 'unlink'."
            )
          );
      }
    } else {
      console.log(chalk.red("No valid profile command provided."));
    }
  });

// Define the 'project' command and its subcommands
program
  .command("project")
  .description("Manage development projects")
  .option("--create", "Create a new project")
  .option("--open", "Open the project in the current directory")
  .option("--delete", "Delete an existing project")
  .action((cmd) => {
    // Handle the subcommands based on the options provided
    if (cmd.create) {
      ProjectCommands.createProject();
    } else if (cmd.open) {
      ProjectCommands.openProject();
    } else if (cmd.delete) {
      ProjectCommands.deleteProject();
    } else {
      console.log(chalk.red("No valid project command provided."));
    }
  });

// Define the 'help' command, which displays the help information
program
  .command("help")
  .description("Display help information")
  .action(() => {
    program.outputHelp(); // Output the help information for the CLI tool
  });

program.parse(process.argv); // Parse the command-line arguments and execute the corresponding commands

// Handle graceful shutdown on Ctrl+C or SIGTERM signals
function handleExit(signal) {
  console.log(
    chalk.yellow(`\nReceived ${signal}. Gracefully shutting down...`)
  );
  // Perform any necessary cleanup here
  process.exit(0);
}

process.on("SIGINT", handleExit); // Handle Ctrl+C (SIGINT)
process.on("SIGTERM", handleExit); // Handle kill command (SIGTERM)
