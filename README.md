# Aurora CLI Tool

The **Aurora CLI Tool** is a powerful command-line utility designed to streamline the creation of extensions for Swift, JavaScript, and TypeScript projects. This tool offers an intuitive interface to scaffold extensions quickly and efficiently, with customizable options including Git integration, author details, categories, and more.

> [!CAUTION]
> The Aurora CLI Tool is still in development and is not complete yet. Some features may be missing or subject to change.

## Key Features

- **Scaffold Extensions Quickly:** Generate fully-structured extensions with predefined templates for Swift, JavaScript, and TypeScript.

- **Customization at Your Fingertips:** Customize your extensions by choosing the language, enabling Git support, specifying categories, and providing author details.

- **User-Centric Design:**  Enjoy guided prompts that ensure all essential information is captured without hassle.

## Development Installation

1. **Clone the Repository:**
Clone the Aurora CLI repository to your local machine:

   ```bash
   git clone https://github.com/AuroraEditor/Aurora-CLI.git
   cd Aurora-CLI
   ```

2. **Install Dependencies:**
Run the following command to install the necessary npm packages:

   ```bash
   npm install
   ```

3. **Make the Script Executable:**
Ensure that the main script (cli.js) is executable:

   ```bash
   chmod +x cli.js
   ```

4. **Link the CLI Tool (Optional):**
If you want to test the CLI tool globally on your system, you can link it:

   ```bash
   npm link
   ```

## Usage Guide

The **Aurora CLI Tool** is designed to streamline the creation and management of extensions, profiles, and development projects. This guide will walk you through using the available commands and their options.

### Table of Contents
- [General Information](#general-information)
- [Commands Overview](#commands-overview)
- [Graceful Shutdown](#graceful-shutdown)

---

### General Information

To use the Aurora CLI tool, ensure you have the necessary permissions and dependencies installed. The CLI tool can be executed directly or globally linked for easier access.

- **Version**: 0.0.1
- **Executable**: `aurora`

### Commands Overview

The Aurora CLI Tool provides the following main commands:

<details>
<summary>1. Extension Commands</summary>
<br>

Manage Aurora Editor extensions with various subcommands.

**Command**: `aurora extension`

- **Create a New Extension**

  ```bash
  aurora extension --create
  ```

  Use this command to create a new extension with guided prompts.

- **List All Extensions**

  ```bash
  aurora extension --list
  ```

  Lists all existing extensions in the current workspace.

- **Upload an Extension**

  ```bash
  aurora extension --upload
  ```

  Uploads the specified extension to a remote repository or server.

- **Update an Extension**

  ```bash
  aurora extension --update <id>
  ```

  Updates an existing extension by its ID.

- **Remove an Extension**

  ```bash
  aurora extension --remove <id>
  ```

  Removes an extension by its ID.

- **Deprecate an Extension**

  ```bash
  aurora extension --deprecate <id>
  ```

  Marks an extension as deprecated by its ID.

- **Install an Extension**

  ```bash
  aurora extension --install
  ```

  Installs the extension found in the current directory, ensuring all dependencies are properly configured.
</details>

<details>
<summary>2. Profile Commands</summary>
<br>
Manage user profiles and Aurora Editor accounts.

<br>

**Command**: `aurora profile`

- **Create a New Profile**

  ```bash
  aurora profile --create
  ```

  Creates a new profile with guided prompts for author details, company information, and website.

- **Remove an Existing Profile**

  ```bash
  aurora profile --remove
  ```

  Removes the existing profile from the current directory.

- **Manage Aurora Account**

  ```bash
  aurora profile --account <action>
  ```
  Manage your Aurora Editor account with the following actions:
  - `create`: Create a new Aurora account.
  - `link`: Link an existing Aurora account.
  - `unlink`: Unlink an Aurora account.

  Example:

  ```bash
  aurora profile --account create
  ```
</details>

<details>
<summary>3. Project Commands</summary>
<br>
Manage development projects efficiently.

<br>

**Command**: `aurora project`

- **Create a New Project**

  ```bash
  aurora project --create
  ```

  Initializes a new development project in the specified directory.

- **Open an Existing Project**

  ```bash
  aurora project --open
  ```

  Opens the project in the current directory.

- **Delete a Project**

  ```bash
  aurora project --delete
  ```

  Deletes the specified project from the workspace.
</details>

<details>
<summary>4. Help Command</summary>
<br>
Display detailed help information about the Aurora CLI Tool and its available commands.
</details>

### Graceful Shutdown

The Aurora CLI Tool is designed to handle termination signals gracefully, ensuring that any ongoing processes are properly cleaned up before the tool exits.

- **Handle Ctrl+C (SIGINT)**
- **Handle Termination (SIGTERM)**

If you manually terminate the CLI tool using `Ctrl+C` or send a termination signal (`SIGTERM`), the tool will display a message and exit cleanly:

```bash
Received SIGINT. Gracefully shutting down...
```

This ensures that no data is lost, and any temporary files or connections are properly closed.

---



### Contributing

We welcome contributions! If you'd like to contribute, please fork the repository and submit a pull request. Be sure to follow our contribution guidelines.

### License

This project is licensed under the MIT License. See the LICENSE file for more details.
