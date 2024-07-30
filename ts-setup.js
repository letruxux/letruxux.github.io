const fs = require("fs");
const exec = require("util").promisify(require("child_process").exec);

async function main() {
  /* init */
  console.log("Initializing npm project...");
  await exec("npm init -y");
  console.log("Installing TypeScript and ts-node...");
  await exec("npm install typescript ts-node --save-dev");
  console.log("Initializing TypeScript configuration...");
  await exec("npx tsc --init");
  console.log("Installing comment-json for later use...");
  await exec("npm i comment-json");

  /* write ./src/index.ts */
  console.log("Setting up project structure...");
  if (!fs.existsSync("./src/")) {
    fs.mkdirSync("./src");
    console.log("Created src directory.");
  }
  if (!fs.existsSync("./src/index.ts")) {
    fs.writeFileSync("./src/index.ts", 'console.log("Hello, World!");\n');
    console.log("Created src/index.ts with initial content.");
  }

  /* write gitignore */
  console.log("Fetching and writing .gitignore...");
  if (!fs.existsSync("./.gitignore")) {
    const gitignoreContent = await fetch(
      "https://raw.githubusercontent.com/microsoft/TypeScript/main/.gitignore"
    ).then((res) => res.text());
    fs.writeFileSync("./.gitignore", gitignoreContent);
    console.log("Created .gitignore file.");
  }

  /* write package.json */
  console.log("Updating package.json...");
  const packageJson = JSON.parse(fs.readFileSync("package.json", { encoding: "utf-8" }));
  packageJson.scripts = {
    build: "npx tsc",
    start: "npx ts-node .",
  };
  packageJson.main = "./src/index.ts";
  fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
  console.log("Updated package.json with scripts and main entry.");

  /* write tsconfig.json */
  console.log("Updating tsconfig.json...");
  const CJSON = require("comment-json");
  const tsConfigJson = CJSON.parse(
    fs.readFileSync("tsconfig.json", { encoding: "utf-8" })
  );
  tsConfigJson.compilerOptions.paths = { "@/*": ["./src/*"] };
  fs.writeFileSync("tsconfig.json", CJSON.stringify(tsConfigJson, null, 2));
  console.log("Updated tsconfig.json with path mappings.");
  setTimeout(() => {
    exec("npm uninstall comment-json");
    console.log("Uninstalled comment-json.");
  }, 50);

  /* init git */
  console.log("Initializing git repository...");
  await exec("git init");
  console.log("Git repository initialized.");
}

main();
