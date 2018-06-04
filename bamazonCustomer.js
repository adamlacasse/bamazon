const mysql = require('mysql');
const inquirer = require('inquirer');

const con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'bamazon'
});

con.connect();
 
// this works, which is nice............
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var sql = "INSERT INTO products(image, product_name, product_desc, department_name, consumer_price, stock_quantity, business_cost) VALUES('https://images.google.com/','Nothing of Use','The stuff that makes you feel the things','FairyLand',88.88,8,14.25)";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
//   });
// });
 
function displayInventory(){
  con.query('SELECT item_id, product_name, department_name, consumer_price, stock_quantity FROM products', function (error, results) {
    if (error) throw error;
      var displayString = '';
      for (i = 0; i < results.length; i++){
        displayString += `Product #: ${results[i].item_id}\n`;
        displayString += `Product: ${results[i].product_name}\n`;
        displayString += `Department: ${results[i].department_name}\n`;
        displayString += `Price: ${results[i].consumer_price}\n`;
        displayString += `Qty Available: ${results[i].stock_quantity}\n`;
        displayString += '-----------------------------------------\n'
      }
      console.log(displayString);
  });
} // end displayInventory

displayInventory();
con.end();
