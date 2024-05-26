# irm https://letruxux.github.io/ts-setup.ps1 | iex

# Create src directory
New-Item -ItemType Directory -Path "src" -Force

# Initialize npm with default settings
npm init -y

# Install json package globally
npm install -g json

# Update package.json
json -I -f package.json -e 'this.main = "./src/index.ts"'
json -I -f package.json -e 'this.scripts.dev = "npx nodemon ."'
json -I -f package.json -e 'this.scripts.start = "npx ts-node ."'

# Uninstall json package
npm uninstall json

# Install development dependencies
npm install typescript nodemon ts-node --save-dev

# Initialize TypeScript configuration
npx tsc --init

# Create an empty index.ts file in src directory
New-Item -ItemType File -Path "./src/index.ts" -Force
