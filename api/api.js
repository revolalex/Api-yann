/************************** Module ********************************/
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet")
require("dotenv").config()


/************************** MidlleWare ****************************/
app.use(express.urlencoded({ extended: false }));
// parse requests of content-type: application/json
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware
app.use(cors());
// const allowCrossDomain = function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "*");
//   res.header("Access-Control-Allow-Headers", "*");
//   // token header
//   res.header("Access-Control-Request-Headers: Authorization");
//   next();
// };
// app.use(allowCrossDomain);
app.use(helmet)

/************************** connection mysql ***********************/
const connection = require("./database/db");
connection.connect();

/************************** Routes *********************************/
require("./routes/galerieRoutes")(app, connection)
require("./routes/adminRoutes")(app, connection)
require("./routes/mailRouter")(app)
require("./routes/archiveRoutes")(app, connection)
require("./routes/carousselRoutes")(app, connection)

app.listen(process.env.PORT || 8080, function () {
  console.log("server listening on: http://localhost:8080/");
});

