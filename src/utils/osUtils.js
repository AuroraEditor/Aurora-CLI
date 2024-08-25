import os from "os";

/**
 * Checks if the current operating system is macOS.
 *
 * @returns {boolean} - Returns `true` if the current OS is macOS (Darwin), otherwise `false`.
 */
export function isMacOS() {
  // os.platform() returns a string identifying the operating system platform, such as 'darwin' for macOS
  return os.platform() === "darwin";
}
