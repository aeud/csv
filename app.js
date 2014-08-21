var fs = require('fs');
var csv = require('fast-csv')
var stream = fs.createReadStream('in.csv');
var countries = [];
var mysql      = require('mysql');
var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database: 'globale'
});


var csvStream = csv()
 .on("record", function(data){
	 if (data[3] && data[4] && data[9]) {
	     countries.push({
			 created_at: new Date(),
			 updated_at: new Date(),
			 name: data[0],
			 english_name: data[0],
			 iso_code_2: data[2],
			 iso_code_3: data[3],
			 call_code: data[9],
	     });
	 }
    
 })
 .on("end", function(){
     //console.log(countries);

	 
	 for (var i = 0; i < countries.length; i++) {
		 var country = countries[i];
		 //console.log(countries[i])
		 insert(country)
		
	 	
	 }
	  
	 
 });
 
 function insert(country) {

	 var country = country;
	 pool.getConnection(function(err, connection) {
		 console.log(country)
		 connection.query('INSERT INTO country SET ?', [country], function(err, rows, fields) {
		   if (err) throw err;
		   connection.release();
		 });
	 });
 }

stream.pipe(csvStream);