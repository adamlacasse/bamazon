var inquirer = require('inquirer');
var mysql = require('mysql');

var con = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	user: 'root',
	password: 'root',
	database: 'bamazon'
});

function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

function chooseItem(){
		inquirer.prompt([
		{
		type: 'input',
		name: 'item_id',
		message: 'Please enter the Product # for the product you would like to purchase.\n\n',
		validate: validateInput,
		filter: Number
		}
	]).then(function(input){
		var item = input.item_id;
		var queryStr = 'SELECT * FROM products WHERE ?';

		con.query(queryStr, {item_id: item}, function(err, data){
			if (err) throw err;
			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				displayInventory();
			}
			else {
				chooseQty(item);
			}
		});  // end of con.query
	}); // end of .then
} // end of chooseItem


function chooseQty(qty){
	inquirer.prompt([
	{
	type: 'input',
	name: 'quantity',
	message: 'How many do you need?\n\n',
	validate: validateInput,
	filter: Number
	}
]).then(function(input){
	var item = qty;
	var quantity = input.quantity;
	var queryStr = 'SELECT * FROM products WHERE ?';

	con.query(queryStr, {item_id: item}, function(err, data){
		if (err) throw err;
		var productData = data[0];
		if (quantity <= productData.stock_quantity){
			console.log('Congratulations, the product you requested is in stock! Placing order!');

			var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;

			con.query(updateQueryStr, function(err, data) {
				if (err) throw err;

				console.log('Your oder has been placed! Your total is $' + productData.consumer_price * quantity);
				console.log('Thank you for shopping with us!');
				console.log("\n---------------------------------------------------------------------\n");

				con.end();
			}); // end of con.query
		} // end of if (quantity <= productData.stock_quantity)
		else {
			console.log('Sorry, there is not enough product in stock.');
			console.log('Please modify your order keeping in mind the Qty Available.');
			console.log("\n---------------------------------------------------------------------\n");
			chooseItem();
		} // end of else
	});  // end of con.query
	}); // end of .then
} // end of chooseQty

function displayInventory(){
    con.query('SELECT item_id, product_name, department_name, consumer_price, stock_quantity FROM products', function (error, results) {
      if (error) throw error;
        var displayString = '-----Bamazon Current Inventory-----\n\n';
        for (i = 0; i < results.length; i++){
			displayString += `Product # ${results[i].item_id}\n`;
          	displayString += `Name: ${results[i].product_name} | `;
          	displayString += `Price: $${results[i].consumer_price} | `;
		  	displayString += `Qty Available: ${results[i].stock_quantity}\n\n`;
        }
        console.log(displayString);
	});
	chooseItem();
  } // end of displayInventory

displayInventory();
