const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// log colors, red, blue, green, reset, yellow
const colors = {
  red: "\x1b[31m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
  yellow: "\x1b[33m",
};

const enumPath = path.join(__dirname, ".", "shared", "enums");
const helpersPath = path.join(__dirname, ".", "shared", "helpers");
const validatorsPath = path.join(__dirname, ".", "shared", "validators");
const indexPath = path.join(__dirname, ".", "shared", "index.js");

const handleCommand = (command) => {
  const yarnInstallShared = spawn("yarn", [command], { shell: true });

  yarnInstallShared.stdout.on("data", (data) => {
    console.log(`${colors.green} ${data} ${colors.green}`);
  });

  yarnInstallShared.stderr.on("data", (error) => {
    console.log(`${colors.red} ${error} ${colors.red}`);
  });

  yarnInstallShared.on("close", (code) => {
    console.log(
      `${colors.reset} Shared files re-installed successfully. Exited with code ${code} ${colors.reset}`
    );
  });
};

let timeout;
const handler = (eventType, filename) => {
  clearTimeout(timeout);

  if (eventType === "change") {
    timeout = setTimeout(() => {
      console.log(
        `\n${colors.yellow}Changes detected in ${colors.yellow} ${colors.blue}${filename}${colors.yellow} file.${colors.reset}`
      );
      handleCommand("re-install-shared");
    }, 100);
  }
};

fs.watch(enumPath, { recursive: true }, handler);
fs.watch(helpersPath, { recursive: true }, handler);
fs.watch(validatorsPath, { recursive: true }, handler);
fs.watch(indexPath, handler);

console.log(
  `Watching for changes for this files: ${colors.blue} \n${enumPath}, \n${helpersPath}, \n${validatorsPath}, \n${indexPath} ${colors.blue}`
);
