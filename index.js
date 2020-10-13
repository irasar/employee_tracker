//require statements
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");
const { Console } = require("console");
const DB = require("./db/dbFunctions.js")

const { start } = require("repl");

var connection = mysql.createConnection({
    host: "localhost",
    //your port; if not 3306
    port: 3306,
    user: "root",
    //your password
    password: "rootroot",
    database: "employees",
});

connection.connect(function (err) {
    if (err) throw err;
    //run the function after the connection is made to prompt the user
    init();
});

//function init()

function init() {
    const logoText = logo({ name: "Employee Manager" }).render();
    console.log(logoText);

    //load our prompts
    loadPrompts();
}

function loadPrompts() {
    inquirer
        .prompt({
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                {
                    name: "View All Employees",
                    value: "VIEW_EMPLOYEES",
                },
                {
                    name: "View All Departments",
                    value: "VIEW_DEPARTMENTS",
                },
                {
                    name: "View All Roles",
                    value: "VIEW_ROLES",
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE",
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT",
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE",
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_ROLE",
                }
            ],
        })
        .then((answers) => {
            //switch statement
            switch (answers.choice) {
                case "VIEW_EMPLOYEES":
                    console.log("view employees");

                    return viewEmployees();
                    break;
                case "VIEW_DEPARTMENTS":
                    console.log("view departments");
                    return viewDepartment();
                    break;

                case "VIEW_ROLES":
                    console.log("View Roles");
                    return viewRoles();
                    break;
                case "ADD_EMPLOYEE":
                    console.log("Add employees");
                    return addEmployee();
                    break;
                case "ADD_ROLE":
                    console.log("Add Role");
                    return addRole();
                    break;
                    case "ADD_DEPARTMENTS":
                    console.log("Add Department");
                    return addDep();
                    break;
                    case "UPDATE_EMPROLE":
                    console.log("Update Employee Roles");
                    return addEmpRole();
                    break;

                default:
                    console.log("quit");
            }
        });
}

const viewEmployees = () => {
    connection.query("SELECT * FROM employee ", function (err, results) {
        if (err) throw err;
        console.table(results);
    });
};

const viewDepartment = () => {
    connection.query("SELECT * FROM department ", function (err, results) {
        if (err) throw err;
        console.table(results);
    });
};

const viewRoles = () => {
    connection.query("SELECT * FROM role ", function (err, results) {
        if (err) throw err;
        console.table(results);
    });
};


const addRole = () => {
    inquirer
        .prompt([{
            type: "input",
            name: "addR",
            message: "What role would you like to add?"
        },
        {
            type: "input",
            name: "addSalary",
            message: "What is the salary for this role?"
        },
        {
            type: "number",
            name: "department",
            message: "What is the department id for this role?"
        }
    ]).then (function(answers){
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answers.addR,
                    salary: answers.addSalary,
                    department_id: answers.department
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your role was created successfully!");
                    // re-prompt the user for if they want to bid or post
                    loadPrompts()
                }
            );
        })
    
};

const addEmpRole = () => {
//calling file:dbfunction.js
// DB.viewEmployees()
