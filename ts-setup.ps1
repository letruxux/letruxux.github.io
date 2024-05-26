# irm https://letruxux.github.io/ts-setup.ps1 | iex

# Initialize git repo
git init

# Create src directory
New-Item -ItemType Directory -Path "src" -Force

# Initialize npm with default settings
npm init -y

# Install development dependencies
npm install typescript nodemon ts-node --save-dev

# Initialize TypeScript configuration
npx tsc --init

# Create an empty index.ts file in src directory
New-Item -ItemType File -Path "./src/index.ts" -Force

# Add .gitignore
(Invoke-WebRequest -Uri "https://raw.githubusercontent.com/microsoft/TypeScript/main/.gitignore").Content | Out-File -FilePath ".gitignore"

# Edit package.json (chatgpt)

# Read the content of package.json into a variable
$json = Get-Content package.json -Raw | ConvertFrom-Json

# Clear the existing scripts object if it exists
$json.psobject.properties.Remove("scripts") | Out-Null

# Create a new scripts object
$scripts = @{
    "dev" = "npx nodemon ."
    "start" = "npx ts-node ."
}

# Set the scripts object in the JSON
$json | Add-Member -MemberType NoteProperty -Name scripts -Value $scripts -Force

# Set or update the main property
$json.main = "./src/index.ts"

# Convert the modified object back to JSON with indentation
$json | ConvertTo-Json -Depth 10 | Set-Content package.json
