//require statements
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");


//function init()

function init () {
    const logoText = logo({ name: "Employee Manager"}.render();
    console.log(logoText);

    //load our prompts
    loadPrompts();
}

function loadPrompts () {
    inquirer.prompt ({
        type: "list",
        name: "choice",
        message
    })
}