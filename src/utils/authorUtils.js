import fs from "fs-extra";
import path from "path";
import os from "os";
import inquirer from "inquirer";
import chalk from "chalk";

// Define the path to the author information file in the user's home directory
const AUTHOR_FILE_PATH = path.join(os.homedir(), ".aurora", "author.json");

/**
 * Retrieves author information from a JSON file or prompts the user for missing fields.
 * If the information is incomplete or missing, the user is prompted to provide the details.
 * The user is also given the option to save this information for future use.
 *
 * @returns {Promise<Object>} - Returns an object containing the author information (name, email, company).
 */
export async function getAuthorInfo() {
  let authorInfo = {}; // Initialize an empty object to hold author information

  try {
    // Check if the author information file exists
    if (await fs.pathExists(AUTHOR_FILE_PATH)) {
      // Read the existing author information from the file
      authorInfo = await fs.readJSON(AUTHOR_FILE_PATH);
      console.log(
        chalk.green(`Loaded author information from ${AUTHOR_FILE_PATH}`)
      );
    } else {
      // If the file does not exist, notify the user
      console.log(
        chalk.yellow(`Author information file not found at ${AUTHOR_FILE_PATH}`)
      );
    }
  } catch (error) {
    // Handle any errors that occur while reading the author information file
    console.error(
      chalk.red("Error reading author information:", error.message)
    );
  }

  const questions = []; // Initialize an array to hold questions for missing fields

  // Check if the author's name is missing and prompt for it if necessary
  if (!authorInfo.name) {
    questions.push({
      type: "input",
      name: "name",
      message: "Enter the author name:",
      validate: (input) => !!input || "Author name is required.",
    });
  }

  // Check if the author's email is missing and prompt for it if necessary
  if (!authorInfo.email) {
    questions.push({
      type: "input",
      name: "email",
      message: "Enter the author email:",
      validate: (input) => {
        if (!input) return true; // email is optional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input) || "Please enter a valid email address.";
      },
    });
  }

  // Check if the author's company is missing and prompt for it if necessary
  if (!authorInfo.company) {
    questions.push({
      type: "input",
      name: "company",
      message: "Enter the author company (optional):",
    });
  }

  // If any questions were added (meaning some information was missing), prompt the user
  if (questions.length > 0) {
    const answers = await inquirer.prompt(questions);
    // Merge the new answers with the existing author information
    authorInfo = { ...authorInfo, ...answers };

    // Prompt the user if they want to save the updated author information
    const saveAuthor = await inquirer.prompt({
      type: "confirm",
      name: "save",
      message: "Would you like to save this author information for future use?",
      default: true,
    });

    // If the user chooses to save the information, write it to the JSON file
    if (saveAuthor.save) {
      try {
        // Ensure the directory for the author file exists and save the updated information
        await fs.ensureDir(path.dirname(AUTHOR_FILE_PATH));
        await fs.writeJSON(AUTHOR_FILE_PATH, authorInfo, { spaces: 2 });
        console.log(
          chalk.green(`Author information saved to ${AUTHOR_FILE_PATH}`)
        );
      } catch (error) {
        // Handle any errors that occur while saving the author information
        console.error(
          chalk.red("Error saving author information:", error.message)
        );
      }
    }
  }

  // Return the complete author information object
  return authorInfo;
}