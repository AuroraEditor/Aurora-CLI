import chalk from "chalk";
import fs from "fs";

// Custom Error Classes
class UserCancelledError extends Error {}
class TtyError extends Error {}

// Example Logging Utility
function logErrorToFile(error) {
  const logMessage = `[${new Date().toISOString()}] ${
    error.stack || error.message
  }\n`;
  fs.appendFileSync("error.log", logMessage);
}

function withErrorHandling(command) {
  return async (...args) => {
    try {
      await command(...args);
    } catch (error) {
      // Custom error handling
      if (error instanceof UserCancelledError) {
        console.log(chalk.yellow("Operation cancelled by the user."));
      } else if (error instanceof TtyError) {
        console.error(
          chalk.red("Prompt couldn’t be rendered in the current environment.")
        );
      } else {
        console.error(
          chalk.red("An unexpected error occurred:"),
          error.message
        );
        logErrorToFile(error);
      }
    }
  };
}

export default withErrorHandling;
