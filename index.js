//require statements
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");
const { Console } = require("console");
const DB = require("./db/dbFunctions.js");

const { start } = require("repl");
const { connect } = require("http2");


const updateArray = [];

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
    getRoles();
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
                },
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
                case "ADD_DEPARTMENT":
                    console.log("Add Department");
                    return addDep();
                    break;
                case "UPDATE_ROLE":
                    console.log("Update Employee Roles");
                    return updateEmpRole();
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
        .prompt([
            {
                type: "input",
                name: "addR",
                message: "What role would you like to add?",
            },
            {
                type: "input",
                name: "addSalary",
                message: "What is the salary for this role?",
            },
            {
                type: "number",
                name: "department",
                message: "What is the department id for this role?",
            },
        ])
        .then(function (answers) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answers.addR,
                    salary: answers.addSalary,
                    department_id: answers.department,
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your role was created successfully!");
                    // re-prompt the user for if they want to bid or post
                    loadPrompts();
                }
            );
        });
};

const addDep = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "depAdd",
                message: "Enter the name of the department you would like to add:",
            },
        ])
        .then(function (answers) {
            connection.query(
                "INSERT INTO department SET ?",
                { name: answers.depAdd },
                function (err) {
                    if (err) throw err;
                    console.log("Department added!");
                    loadPrompts();
                }
            );
        });
};





const addEmployee = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "newFirst",
                message: "What is the employee's first name?",
            },
            {
                type: "input",
                name: "newLast",
                message: "What is the employee's last name?",
            },
            {
                type: "input",
                name: "newRole",
                message: "What is the role ID for this employee?(choose 1-10)",
            },
            {
                type: "input",
                name: "newManager",
                message: "What is the manager's ID for this employee?(manager MUST exis†)",
            },
        ])
        .then((answers) => {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answers.newFirst,
                    last_name: answers.newLast,
                    role_id: answers.newRole,
                    manager_id: answers.newManager,
                },
                (err) => {
                    if (err) throw err;
                }
            );
            console.log("Employee added!");
            loadPrompts();
        });

};  

const updateEmpRole() {

    console.log("Update employee role");

    let query = "SELECT first_name, last_name, title, role.id FROM employee LEFT JOIN role ON role.id = employee.role_id";
    connect.query(query, function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "updateEmp",
                    message: "Pick which employee you would like to update:",
                    choices: updateArray,

                },
                {
                    type: "list",
                    name: "updateRole",
                    message: "Which role would you like this employee to now have?",
                    choices: function () {
                        var updateArray = [];
                        for (let i = 0; i < res.length; i++) {
                            updateArray.push(res[i].title);
                        }
                        return updateArray;
                    }
                }
            ])
            .then(answers => {
                connection.query(
                    "UPDATE employee SET ? WHERE ?",
                    [
                        {
                            role: answers.updateRole

                        },
                        {
                            first_name: answers.updateEmp
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log("Updated employee role!");
                        loadPrompts();
                    });
    })    })    }
}       }// function getRoles() {
//     connect.query("select * FROM employee")
//     function (err) {
//         if (err) throw err;
//     }

    //query database for roles
    //update the local array to have the roles from the role db
    //push those roles to the choice array