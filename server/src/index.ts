import dotenv from 'dotenv';
import mysql from 'mysql2';
dotenv.config();

// Create the connection to the database
const connection = mysql.createConnection(process.env.DATABASE_URL!);

// simple query
connection.query('show tables', function (err, results, fields) {
  console.log(results); // results contains rows returned by server
  console.log(fields); // fields contains extra metadata about results, if available
});

// Example with placeholders
connection.query(
  'select 1 from dual where ? = ?',
  [1, 1],
  function (err: any, results: any) {
    console.log(results);
  }
);

connection.end();
