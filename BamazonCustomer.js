var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
var Table = require("cli-table2");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});
//setting connection MYsql data base
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    queryProducts();

    // connection.end();
});
//prompting use to see what is available for them to purchase
var queryProducts = function () {
    connection.query("SELECT * FROM products ", function (err, res) {
        console.log(chalk.yellow.inverse.italic.bold("Welcome To Bamazon! Please select from the list of products below."))
        console.log("_____________________________________________________________________")
        
        console.log("---------------------------------------------------------------------")
        if (err) throw err;
        var table = new Table ({
            head: [ chalk.blue("ID"), chalk.yellow("PRODUCT"),chalk.cyan("DEPARTMENT"),chalk.green("PRICE"), "QUANITY IN STOCK"]
        })
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$"+ res[i].price, res[i].stock_quantity + "\n"]);
        };
        console.log(table.toString() + "\n\n");
       

        promptCustomer(res);
    })
};
//allows user to search andpurchase by item_id
var promptCustomer = function (res) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "choice",
                message: (chalk.yellow("Enter the ID of the Item you would like to buy.")) + chalk.bgRed.italic("[If not ready, Quit with Q]")
            }
            
        ]).then(function (answer) {
            var correct = false;
        console.log("\n");

            //If user is not ready to make a purchase or does not want to make a second puchase they can Exit the App by pressing "Q".
            if (answer.choice.toUpperCase() == "Q")
                process.exit();
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id == answer.choice) {
                    correct = true;
                    var product = answer.choice;
                    var id = i;
                    inquirer.prompt({
                        type: "input",
                        name: "quant",
                        message: (chalk.yellow("How many Items would you like to buy?")),
                        validate: function (value) {
                            if (isNaN(value) == false) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }).then(function (answer) {
                        console.log("\n");
                        if ((res[id].stock_quantity - answer.quant) > 0) {
                            //This will Update the products database after user buys x amount of items.
                            connection.query("UPDATE products SET stock_quantity = " + (res[id].stock_quantity - answer.quant) +
                                " WHERE item_id= " + product, function (err, res2) {
                                    console.log(chalk.inverse.cyan.bold('"'+res[id].product_name + '"'+" Purchased Successfully!\n"));
                                    var totalCost = (parseInt(res[id].price) * answer.quant).toFixed(2);
                                    console.log(chalk.yellow("===========================================================================" + "\n"));
                                    console.log(chalk.inverse.green("Thank You for shopping with Us!\n"))
                                    console.log(chalk.green("Your Total is:" + " $" + totalCost+ "\n\n"))
                                    console.log(chalk.yellow("==========================================================================="))
                                    promptCustomer(res);

                                })
                        }
                        else {
                            //this message will appear only if user select a higher quantity than is available in stock.
                            console.log(chalk.inverse.red.bold("\n"+"*****Sorry, we don't have enough in stock to fulfill your order*****\n\n"));
                            promptCustomer(res);
                        }
                    })
                }
            }
            //user must select from items ID's provided if not erros message will appear.
            if (i == res.length && correct == false) {
                console.log(chalk.inverse.red.bold("\n"+"****Not a Valid Selection!****\n\n"));
                console.log(chalk.inverse.yellow.italic.bold("***Please choose from the item ID's Provided, Thank you!***\n\n"));
                promptCustomer(res);
            }
        })

}


