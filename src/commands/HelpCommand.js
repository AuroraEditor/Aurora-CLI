// The HelpCommand class is responsible for generating a structured help object
// from a command-line program defined using a command-line framework like Commander.js.
class HelpCommand {
  /**
   * Generates a structured help object that contains details about the program,
   * including its commands, options, and descriptions.
   *
   * @param {Object} program - The command-line program object, typically an instance of a command-line framework like Commander.js.
   * @returns {Object} - A structured object containing the program's name, description, version, commands, and options.
   */
  static generateHelp(program) {
    // Map over the commands defined in the program to extract their name, description, and options.
    const commands = program.commands.map((cmd) => ({
      name: cmd.name(), // Get the name of the command
      description: cmd.description(), // Get the description of the command
      options: cmd.options.map((opt) => ({
        flags: opt.flags, // Get the flags for the option (e.g., "-f, --force")
        description: opt.description, // Get the description of the option
      })),
    }));

    // Map over the global options defined in the program to extract their flags and descriptions.
    const options = program.options.map((opt) => ({
      flags: opt.flags, // Get the flags for the option
      description: opt.description, // Get the description of the option
    }));

    // Return a structured object containing the program's metadata and its commands and options.
    return {
      name: program.name(), // Get the name of the program
      description: program.description(), // Get the description of the program
      version: program.version(), // Get the version of the program
      commands, // Include the commands array in the result
      options, // Include the global options array in the result
    };
  }
}

export default HelpCommand;
