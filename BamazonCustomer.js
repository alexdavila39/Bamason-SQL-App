var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Josafat18",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    queryProducts();

    // connection.end();
});

var queryProducts = function () {
    connection.query("SELECT * FROM products ", function (err, res) {
        console.log(chalk.yellow.inverse.italic.bold("Welcome To Bamazon! Please select from the list of products below."))
        console.log("_____________________________________________________________________")
        console.log(chalk.inverse("Item ID || Product Name || Department || Price || Invetory ||"))
        console.log("---------------------------------------------------------------------")
        if(err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(chalk.blue(res[i].item_id) + " || " +(chalk.yellow(res[i].product_name)) + " || " + (chalk.cyan(res[i].department_name)) + " || " +(chalk.green(res[i].price)) + " || " +(chalk.red(res[i].stock_quantity)) + "\n");
        };
        console.log("------------------------------------------------------");

        promptCustomer(res);
    })
};

var promptCustomer = function (res) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "choice",
                message: "Enter the ID of the Item you would like to buy. [if not ready, Quit with Q]"
            }
        ]).then(function (answer) {
            var correct = false;
            if (answer.choice.toUpperCase() == "Q")
                process.exit();
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id == answer.choice) {
                    correct = true;
                    var product = answer.choice;
                    var id= i;
                    inquirer.prompt({
                        type: "input",
                        name: "quant",
                        message: "How many Items would you like to buy?",
                        validate: function (value) {
                            if (isNaN(value) == false) {
                                return true;
                            } else {
                                return false;

                            }
                        }
                    }).then(function (answer) {
                        if((res[id].stock_quantity - answer.quant)> 0) {
                            connection.query("UPDATE products SET stock_quantity = " + (res[id].stock_quantity - answer.quant) + 
                            " WHERE item_id= " + product, function (err, res2) {
                                console.log(chalk.inverse.bold("Product Purchased Succefully!"));
                                var totalCost = res[id].price * product.quant;
                                console.log("======================================================");
                                // console.log("Total: "+ " $"+ totalCost)                                
                                queryProducts();

                       })
                    }
                        else {
                            console.log(chalk.bgRed.bold("Sorry, We do not have the inventory for the amount Requested."));
                            console.log(chalk.bgGreen.bold("*****Please place order for less quantities*****"));
                            promptCustomer(res);
                        }
                    })
                }
            }
            if (i == res.length && correct == false) {
                console.log("Not a Valid Selection!");
                promptCustomer(res);
            }
        })

}


