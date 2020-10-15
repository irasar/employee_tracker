//require statements
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");
const { Console } = require("console");
const DB = require("./db/dbFunctions.js");

const { start } = require("repl");
const { connect } = require("http2");

let roleID;

const updateArray = [];
//connecting to db
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employees",
});

connection.connect(function (err) {
    if (err) throw err;
    init();
});

//displaying big logo
function init() {
    const logoText = logo({ name: "Employee Manager" }).render();
    console.log(logoText);
    //calling our main menu function for prompts
    loadPrompts();
}
//displaying main menu prompts 
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
            //calling functions depending on users choice
            switch (answers.choice) {
                case "VIEW_EMPLOYEES":
                    return viewEmployees();
                    break;
                case "VIEW_DEPARTMENTS":
                    return viewDepartment();
                    break;
                case "VIEW_ROLES":
                    return viewRoles();
                    break;
                case "ADD_EMPLOYEE":
                    return addEmployee();
                    break;
                case "ADD_ROLE":
                    return addRole();
                    break;
                case "ADD_DEPARTMENT":
                    return addDep();
                    break;
                case "UPDATE_ROLE":
                    return updateEmpRole();
                    break;
                default:
                    console.log("quit");
            }
        });
}

const viewEmployees = () => {
    connection.query( "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee INNER JOIN role on role_id = role.id INNER JOIN department on department_id = department.id", function (err, results) {
        if (err) throw err;
        //logging the table results to the console
        console.table(results);
        //displaying main menu prompts
        loadPrompts();
    });
};

const viewDepartment = () => {
    connection.query("SELECT * FROM department ", function (err, results) {
        if (err) throw err;
        //logging the table results to the console
        console.table(results);
         //displaying main menu prompts
        loadPrompts();
    });
};

const viewRoles = () => {
    connection.query("SELECT * FROM role ", function (err, results) {
        if (err) throw err;
        //logging the table results to the console
        console.table(results);
         //displaying main menu prompts once user has finished prompt
        loadPrompts();
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
                    //displaying main menu prompts once user has finsihed prompt
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
                //adding into department table
                "INSERT INTO department SET ?",
                { name: answers.depAdd },
                function (err) {
                    if (err) throw err;
                    console.log("Your department was created successfully!");
                    //displaying main menu prompts once user has finished prompt
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
                //adding to employee table
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
            console.log("Your employee was created successfully!");
            //displaying main menu prompts once user has finished prompt
            loadPrompts();
        });

};

function updateEmpRole() {
    console.log("Update employee role");
    let query = "SELECT first_name, last_name, title, role.id FROM employee LEFT JOIN role ON role.id = employee.role_id";
    connection.query(query, function (err, results) {
        if (err) throw err;
        console.log(updateArray);
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
                        for (let i = 0; i < results.length; i++) {
                            updateArray.push(results[i].title);
                        }
                        return updateArray;
                    }
                }
            ])
            .then(answers => {
                console.log(answers);
                let name = answers.updateEmp;
                connection.query("SELECT role.id FROM role WHERE role.title = (?)", [answers.updateRole],
                function(err, res){
                    if (err) throw err;
                    roleID = res[0].id;
                    console.log(roleID);
                    updateEmployee(name, roleID);
                }
                )
                 //displaying main menu prompts once user has finished prompt
                loadPrompts();
            })
    })
}
     function getRoles() {
    connection.query("SELECT * FROM employee",
    function (err, results) {
        if (err) throw err;
for (let i = 0; i < results.length; i++) {
    updateArray.push(results[i].first_name);
}
    })
}
    function updateEmployee(fname, id){
        connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?",[ id, fname ], 
        function(err, res) {
        if (err) throw err;
        console.log(fname + " has been updated!")
      });
    }