var mysql = require("mysql");
var inquirer = require("inquirer");

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
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " || " + res[i].product_name + " || " + res[i].department_name + " || " + res[i].price + " || " + res[i].stock_quantity + "\n");
        };
        console.log("-----------------------------------------------");

        promptCustomer(res);
    })
};

var promptCustomer = function (res) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "buy",
                message: "Enter the ID of the Item you would like to buy. [if not ready, Quit with Q]"
            }
        ]).then(function (answer) {
            var correct = false;
            if (answer.buy.toUpperCase() == "Q")
                process.exit();
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id == answer.buy) {
                    correct = true;
                    var product = answer.buy;
                    var id = i;
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
                        if ((res[id].stock_quantity-answer.quant) > 0) {
                            connection.query("UPDATE products SET stock_quantity = " + (res[id].stock_quantity-answer.quant) + "WHERE product_name= " + product, function (err, res2) {
                                console.log("Product Bought!");
                                queryProducts();

                            })
                        } else {
                            console.log("Selection is not valid");
                            promptCustomer(res);
                        }
                    })
                }
            }
            if (i == res.length && correct == false) {
                console.log("Nota Valid Selection!");
                promptCustomer(res);
            }
        })

}
