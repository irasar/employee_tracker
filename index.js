//require statements
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");
const { Console } = require("console");

const { start } = require("repl");

var connection = mysql.createConnection({
    host: "localhost",
    //your port; if not 3306
    port: 3306,
    user: "root",
    //your password
    password: "rootroot",
    database: "employees"
});

connection.connect(function(err){
    if (err) throw err;
    //run the function after the connection is made to prompt the user
    start();
});
//function init()

function init () {
    const logoText = logo({ name: "Employee Manager"}).render();
    console.log(logoText);

    //load our prompts
    loadPrompts();
}

function loadPrompts () {
    inquirer.prompt ({
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
            {
                name: "View All Employees",
                value: "VIEW_EMPLOYEES"
            },
            {
                name: "View All Departments",
                value: "VIEW_DEPARTMENTS"
            }
    ]
    })
    .then(answers => {
            //switch statement
            switch (answers.choice) {
                case "VIEW_EMPLOYEES":
                    console.log("view employees");
                   
                    return viewEmployees();
                    break;
                case "VIEW_DEPARTMENTS":
                    console.log("view departments");
                    break;
                default:
                    console.log("quit");
                
            }
      })

}

const viewEmployees = () => {
    connection.query("SELECT * FROM employee ", function(err, results) {
        if (err) throw err;
        console.table(results);
    })
}

init();
//calling file:dbfunction.js
    // DB.viewEmployees()