DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products(
    item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price INTEGER(10),
    stock_quantity INTEGER(10)
);

INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES("Kobe Bryant Jersey", "Clothing", 150, 10),
("NBA 2k19", "Video Games", 70, 100),
("Fifa 2020", "Video Games", 70, 50),
("Inception", "Movies", 25, 30),
("PlayStation 5", "Video Games",700,500),
("Pursuit of Happyness", "Movies",30, 100),
("Harry Potter Series", "Movies", 75, 50),
("Rich Dad Poor Dad","Books", 20, 75),
("Mamba Mentality", "Books", 24, 81),
("Troy Palomalu Jersey", "clothing",150, 30)
