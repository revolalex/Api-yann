// hass Password
const saltRounds = 10;
const bcrypt = require("bcrypt");
// token
const jwt = require("jsonwebtoken");
const config = require("../modules/config");
//sql
const adminSql = require('../sql/adminSql')
const auth = require('../middlewares/auth')

const adminRouter = async function (app, connection) {
  /******************** ADMIN PART ********************/

  /***** Check if user with this userName already exist ****/
  await app.use("/signup/", (req, res, next) => {
    connection.query(
      `SELECT * FROM admin WHERE name = '${req.body.name}'`,
      (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          res.status(200).send("This user already exist");
        } else {
          next();
        }
      }
    );
  });

  /******************** SIGN-UP ********************/
  //name, is_super_admin, password, email, url
  await app.post("/signup/", auth, function (req, res) {
    try {
      const name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
      const is_super_admin = req.body.is_super_admin
      const password = req.body.password;
      const email = req.body.email;
      const url = req.body.url;
      // Handle Error
      switch (true) {
        case name.length = 0:
          throw "Names is required"
        case name.length < 3:
          throw "Name error min 3 characters";
        case email.length = 0:
          throw "Email is required";
        case password.length = 0:
          throw "Password is required";
        case password.length < 8:
          throw "Password error min 8 character";
        case url.length = 0:
          throw "Url is required";
        case url.length < 8:
          throw "Url error min 8 characters";
        case is_super_admin != 0 || 1:
          throw "is_super_admin must be 1 or 0";
        case is_super_admin.length = 0:
          throw "is_super_admin is required";
        default:
          // Hash the password
          const passwordHash = bcrypt.hashSync(password, saltRounds);
          // Stock the hash password in db
          const user = [name, is_super_admin, passwordHash, email, url];
          connection.query(adminSql.signUp, [user], function (err, results) {
            if (err) throw err;
            res.status(201).send(results);
          });
          break;
      }
    } catch (error) {
      res.status(203).send(error)
    }
  });

  /******************** SIGN-IN ********************/
  // check if the password is the good one for this specific email
  // then deliver a jwt
  await app.post("/signin/", function (req, res) {

    const name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
    const password = req.body.password;
    const email = req.body.email
    connection.query(adminSql.checkemail, [email], function (err, results) {
      if (err) throw err;
      //handle email error
      if (!Array.isArray(results) || !results.length) {
        res.status(203).send("Sorry, email incorrect");
      }
    })
    connection.query(adminSql.signIn, [name], function (err, results) {
      if (err) throw err;
      //handle name error
      if (!Array.isArray(results) || !results.length) {
        res.status(203).send("Sorry, name incorrect");
      } else {
        const nameInDb = results[0].name;
        const passwordStockInDb = results[0].password;
        const emailInDb = results[0].email;
        const id = results[0].id;
        const url = results[0].url;
        const is_super_admin = results[0].is_super_admin;
        /******* TOKEN *******/
        const token = jwt.sign(
          { name: nameInDb, email: emailInDb, id: id },
          config.secret
        );
        bcrypt.compare(password, passwordStockInDb, function (err, result) {
          if (result === true) {
            // get the decoded payload 
            const decoded = jwt.decode(token);
            console.log("DECODED", decoded);
            res.status(200).send({
              auth: true,
              token: token,
              id: id,
              name: nameInDb,
              url: url,
              is_super_admin: is_super_admin
            });
          } else {
            res.status(203).send("Sorry, password incorrect");
          }
        });
      }
    });
  });

  /******************** Get all admin ********************/
  await app.get("/admin/", auth, function (req, res) {
    try {
      connection.query(adminSql.getAll, function (err, results) {
        if (err) throw err;
        res.send(results);
      });
    } catch (error) {
      res.status(203).send(error)
    }
  })

  /******************** Change email of an admin ********************/
  await app.put("/admin/", auth, function (req, res) {
    try {
      connection.query(adminSql.updateEmail(req.body.email, req.body.specify), function (err, results) {
        if (err) throw err;
        res.send(results);
      });
    } catch (error) {
      res.status(203).send(error)
    }
  })


  /************ delete user with this email ==> /users/:email **************/
  await app.delete("/admin/:email", auth, function (req, res) {
    try {
      const email = req.params.email;
      connection.query(adminSql.deleteAdmin, [email], function (err, results) {
        if (err) throw err;
        // handle unknown user
        if (results.affectedRows > 0) {
          res.status(200).send("Users removed");
        } else {
          res.status(203).send("Unknown users");
        }
      });
    } catch (error) {
      res.status(203).send(error)
    }
  });

};
module.exports = adminRouter;
