import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import withErrorHandling from "../utils/errorHandler.js";
import { getAuthorInfo } from "../utils/authorUtils.js";

// The ProfileCommands class provides commands to manage user profiles, such as creating, removing, and linking profiles.
class ProfileCommands {
  /**
   * Creates a new profile by fetching existing author information and prompting the user for additional details.
   * The profile is saved in a `profile.json` file in the current working directory.
   */
  static createProfile = withErrorHandling(async () => {
    // Fetch existing author information, which may include name, company, and website
    const authorInfo = await getAuthorInfo();

    // Prompt the user for additional profile details like company name and website
    const profileAnswers = await inquirer.prompt([
      {
        type: "input",
        name: "company",
        message: "Enter your company name (optional):",
        default: authorInfo.company || "", // Pre-fill with existing company info if available
      },
      {
        type: "input",
        name: "website",
        message: "Enter your website URL (optional):",
        default: authorInfo.website || "", // Pre-fill with existing website info if available
      },
    ]);

    // Construct the profile data object with the collected information
    const profileData = {
      author: authorInfo.name, // Use the author's name from the fetched info
      company: profileAnswers.company || "", // Use the provided or existing company name
      website: profileAnswers.website || "", // Use the provided or existing website URL
    };

    // Define the path where the profile will be saved
    const profilePath = path.join(process.cwd(), "profile.json");

    // Write the profile data to a JSON file with proper formatting
    fs.writeFileSync(profilePath, JSON.stringify(profileData, null, 2));

    // Confirm successful creation of the profile
    console.log(chalk.green("Profile created successfully."));
  });

  /**
   * Removes the profile by deleting the `profile.json` file from the current working directory.
   * The user is prompted for confirmation before the file is deleted.
   */
  static removeProfile = withErrorHandling(async () => {
    // Define the path to the profile file
    const profilePath = path.join(process.cwd(), "profile.json");

    // Check if the profile file exists
    if (!fs.existsSync(profilePath)) {
      console.log(chalk.red("No profile found to remove."));
      return;
    }

    // Prompt the user to confirm the deletion of the profile
    const { confirmDeletion } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmDeletion",
        message:
          "Are you sure you want to delete the profile? This action cannot be undone.",
        default: false,
      },
    ]);

    // If the user confirms, delete the profile file
    if (confirmDeletion) {
      try {
        await fs.remove(profilePath);
        console.log(chalk.green("Profile removed successfully."));
      } catch (error) {
        console.error(
          chalk.red("Failed to remove the profile:", error.message)
        );
      }
    } else {
      // If the user cancels, notify them of the cancellation
      console.log(chalk.yellow("Profile removal canceled."));
    }
  });

  /**
   * Placeholder function for creating an Aurora account.
   * This function is wrapped with error handling to manage potential errors gracefully.
   * Currently, the implementation is pending.
   */
  static createAuroraAccount = withErrorHandling(() => {
    console.log(chalk.red("Implementation pending."));
  });

  /**
   * Placeholder function for linking an Aurora account.
   * This function is wrapped with error handling to manage potential errors gracefully.
   * Currently, the implementation is pending.
   */
  static linkAuroraAccount = withErrorHandling(() => {
    console.log(chalk.red("Implementation pending."));
  });

  /**
   * Placeholder function for unlinking an Aurora account.
   * This function is wrapped with error handling to manage potential errors gracefully.
   * Currently, the implementation is pending.
   */
  static unlinkAuroraAccount = withErrorHandling(() => {
    console.log(chalk.red("Implementation pending."));
  });
}

export default ProfileCommands;
