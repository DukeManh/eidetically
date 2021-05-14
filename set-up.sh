git init
echo "Git initialized"

jq '.compilerOptions.strict = true' tsconfig.json
echo "Enabled strict compilerOptions"

npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
echo "Installed eslint"

npm i -D prettier eslint-plugin-prettier eslint-config-prettier
echo "Installed prettier"

mkdir .vscode
echo "Created .vscode"

touch .vscode/settings.json
echo "Created vscode settings"

jq '.scripts.type-check="tsc --project tsconfig.json --pretty --noEmit"' package.json
echo "Added type check script"

jq '.scripts.lint = "eslint --ext js,jsx,ts,tsx --fix"' package.json
echo "Added lint script"

npm install -D husky
echo "Installed husky"

npx husky install
echo "Enabled husky"

jq 'scripts.postinstall = "husky install"' package.json
echo "Added husky script"

npx husky add .husky/pre-commit "npm run type-check && npm run lint"
echo "Add husky pre commit script"

npm i -D lint-staged
echo "Added lint-staged script"

touch lint-staged.config.js
echo "Created lint-staged config"



