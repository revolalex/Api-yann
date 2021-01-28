const mysql = require("mysql2");
const adminSql = require('../sql/adminSql')
require('dotenv').config();
// ionos Database for deploy
const connection = mysql.createConnection({
  host: "db5001572760.hosting-data.io",
  user: "dbu834634",
  password: process.env.PASSWORDDB,
  database: "dbs1311187",
  port: 3306
});

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "alexandre",
//   database: "yann",
// });

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected to DB");

  const createDB = "CREATE database IF NOT EXISTS yann";
  connection.query(createDB, function (err, results) {
    if (err) throw err;
  });

  // id, is_menu, galerie_name, caption, filename, alt
  const galerie_photo =
    "CREATE TABLE IF NOT EXISTS galerie_photo (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, is_menu BOOLEAN, galerie_name VARCHAR(50) NOT NULL, caption VARCHAR(50) NOT NULL,  filename VARCHAR(100) NOT NULL , alt VARCHAR(50));";
  connection.query(galerie_photo, function (err, results) {
    if (err) throw err;
  });


  // id, name, is_super_admin, password, email, url
  const adminTable =
    "CREATE TABLE IF NOT EXISTS admin (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL, is_super_admin BOOLEAN, password VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL , url VARCHAR(500) NOT NULL);";
  connection.query(adminTable, function (err, results) {
    if (err) throw err;
  })

  //create admin Yann Corchet
  let yannAdmin = ['2', 'Yann', 0, process.env.YANN_ADMIN_PASS, 'yanncrochet@wanadoo.fr', 'https://yanncrochet.com/images/PortraitYC.JPG'];
  connection.query(adminSql.createAdmins, [yannAdmin], function (err, results) {
    if (err) throw err;
  })

  //create superAdmin Alexandre
  let alexSuperAdmin = ['1', 'Alexandre', 1, process.env.ALEX_ADMIN_PASS, 'revolalex@gmail.com', 'https://revol-cv.netlify.app/asset/alex2.png'];
  connection.query(adminSql.createAdmins, [alexSuperAdmin], function (err, results) {
    if (err) throw err;
  })

  // id, text, galerie_name, title, date, filename
  const archiveTable =
    "CREATE TABLE IF NOT EXISTS archive (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, text VARCHAR(1000) NOT NULL, galerie_name VARCHAR(50), title VARCHAR(50) NOT NULL, date VARCHAR(12), filename VARCHAR(100) NOT NULL );"
  connection.query(archiveTable, function (err, results) {
    if (err) throw err;
  })

  // id, filename, rating
  const archiveRating =
    "CREATE TABLE IF NOT EXISTS archive_rating (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, filename VARCHAR(100) NOT NULL, rating VARCHAR(3) NOT NULL);"
  connection.query(archiveRating, function (err, results) {
    if (err) throw err;
  })


    // id, filename
    const carousselTable =
    "CREATE TABLE IF NOT EXISTS caroussel (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, filename VARCHAR(100) NOT NULL);"
  connection.query(carousselTable, function (err, results) {
    if (err) throw err;
  })
});

module.exports = connection;
