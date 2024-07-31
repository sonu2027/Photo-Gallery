// setup files
# npm init

# nodemon
1. whenever your files it start the server automatically
2. Install nodemon as dev dependencies by writing npm i -D nodemon
3. open package.json and write "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js" on script. 
--> src/index.js says that it will track the inedx.js files whenever it saves the server reload auto

# prettier
1. not necessary to know much about it
2. prettier is used for making code same for everyone
3. install prettier as npm i prettier
4. after installation make .prettierrc in root folder
5. define for everyone
{
    "singleQuote": false,
    "tabWidth": 2,
    "bracketSpacing": true,
    "semi": true,
    "trailingComma": "es5"
}
6. make a .prettierignore and say prettier what files to ignore in which it doesn't apply it code formattor
/.vscode
/node_modules
./dist
*.env
.env
.env.*

// Database connection

# connect database
1. got to mongodb atlas and make a databse with ip add : 0.0.0.0/0 with a username and password
2. make a .env file and write mongoDB url and port number where the server run 
3. i mongoose and express and dotenv
4. mongoose connect with db

# install cookie-parser and cors