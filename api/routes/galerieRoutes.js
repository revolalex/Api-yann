const auth = require('../middlewares/auth')
const multer = require('multer')
const fs = require('fs')
const galerieSql = require('../sql/galerieSql')

const galerieRouter = async function (app, connection) {

  // change storage repo
  const storageGalerie = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/assets/uploads/images/galerie/');
    },
    filename: function (req, file, cb) {

      const date = new Date();
      const dateStr =
        ("00" + (date.getMonth() + 1)).slice(-2) +
        ("00" + date.getDate()).slice(-2) +
        date.getFullYear() +
        ("00" + date.getHours()).slice(-2) +
        ("00" + date.getMinutes()).slice(-2) +
        ("00" + date.getSeconds()).slice(-2);

      cb(null, dateStr + file.originalname);
    }
  });
  // filter allowed only image
  const fileFilter = function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Wrong file type")
      error.code = "WRONG_FILE_TYPE"
      return cb(error, false)
    }
    // it's ok
    cb(null, true)
  }

  const uploadGalerie = multer({
    // if you want to stock the image
    storage: storageGalerie,
    limits: {
      // 1.5 mega
      fileSize: 1500000
    },
    fileFilter
  })

  // middleware to handle file format
  app.use(function (err, req, res, next) {
    if (err.code === "WRONG_FILE_TYPE") {
      res.send("Error only images are allowed")
    }
    return
  })

  /******************* POST IMAGE *******************/
  /******************** IMAGE ***********************/
  await app.post("/galerie/", auth, uploadGalerie.single('file'), function (req, res) {

    const dateNow = new Date();
    // format MM/DD/HH/MM/SS
    const dateStr =
      ("00" + (dateNow.getMonth() + 1)).slice(-2) +
      ("00" + dateNow.getDate()).slice(-2) +
      dateNow.getFullYear() +
      ("00" + dateNow.getHours()).slice(-2) +
      ("00" + dateNow.getMinutes()).slice(-2) +
      ("00" + dateNow.getSeconds()).slice(-2);

    const filename = dateStr + req.file.originalname
    const is_menu = req.body.is_menu
    const galerie_name = req.body.galerie_name
    const caption = req.body.caption
    const alt =
      req.body.alt.charAt(0).toUpperCase() +
      req.body.alt.slice(1);

    const imgToAdd = [is_menu, galerie_name, caption, filename, alt];


    connection.query(galerieSql.postImg, [imgToAdd], function (err, results) {
      if (err) throw err;
      res.send(results);
    });
  });

  /************************** DELETE **************************/
  /***  delete image with this filename in DB and in folder ***/
  await app.delete("/galerie/delete/:filename", auth, function (req, res) {
    try {
      const filename = req.params.filename;
      connection.query(galerieSql.deleteImg, [filename], function (err, results) {
        if (err) throw err;
        // handle unknown user
        if (results.affectedRows > 0) {
          res.status(200).send("image removed");
          const path = `./src/assets/uploads/images/galerie/${filename}`
          //file removed
          fs.unlink(path, (err) => {
            if (err) {
              throw (err)
            }
          })
        } else {
          throw "image unknown";
        }
      });
    } catch (error) {
      res.status(203).send(error)
    }
  });

  /************************** FORET PART **************************/
  /******************** Get all galerie foret ********************/
  await app.get("/galerie/foret/", function (req, res) {
    try {
      connection.query(galerieSql.getForet, function (err, results) {
        if (err) throw err;
        res.send(results);
      });
    } catch (error) {
      res.status(203).send(error)
    }
  })

  /************************** MICRO PART **************************/
  /******************** Get all galerie Micro ********************/
  await app.get("/galerie/micro", function (req, res) {
    try {
      connection.query(galerieSql.getMicro, function (err, results) {
        if (err) throw err;
        res.send(results);
      });
    } catch (error) {
      res.status(203).send(error)
    }
  })

    /************************** MICRO PART **************************/
  /******************** Get all galerie Micro ********************/
  await app.get("/galerie/flore", function (req, res) {
    try {
      connection.query(galerieSql.getFlore, function (err, results) {
        if (err) throw err;
        res.send(results);
      });
    } catch (error) {
      res.status(203).send(error)
    }
  })

  /************************** EAU PART **************************/
  /******************** Get all galerie Eau ********************/
  await app.get("/galerie/eau", function (req, res) {
    try {
      connection.query(galerieSql.getEau, function (err, results) {
        if (err) throw err;
        res.send(results);
      });
    } catch (error) {
      res.status(203).send(error)
    }
  })

    /************************** Jardin PART **************************/
  /******************** Get all galerie Jardin ********************/
  await app.get("/galerie/jardin", function (req, res) {
    try {
      connection.query(galerieSql.getJardin, function (err, results) {
        if (err) throw err;
        res.send(results);
      });
    } catch (error) {
      res.status(203).send(error)
    }
  })

      /************************** Noir PART **************************/
  /******************** Get all galerie Noir ********************/
  await app.get("/galerie/noir", function (req, res) {
    try {
      connection.query(galerieSql.getNoir, function (err, results) {
        if (err) throw err;
        res.send(results);
      });
    } catch (error) {
      res.status(203).send(error)
    }
  })

};

module.exports = galerieRouter;
