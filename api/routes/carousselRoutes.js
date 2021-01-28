const multer = require('multer')
const auth = require('../middlewares/auth')
const fs = require('fs')
const carouselSql = require('../sql/carouselSql')

const carousselRouter = async function (app, connection) {
    // change storage repo
    const storageCaroussel = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './src/assets/uploads/images/caroussel/');
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

    const uploadCaroussel = multer({
        // if you want to stock the image
        storage: storageCaroussel,
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

    /******************************** /post caroussel ****************************/
    /************ Create unique filename, upload file, and stock filename in db  **************/
    await app.post("/caroussel/", auth, uploadCaroussel.single('file'), function (req, res) {
        try {
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
            const imgToAdd = [filename];

            switch (true) {
                case filename.length < 1:
                    throw "photo is required";
                default:
                    connection.query(carouselSql.addImg, [imgToAdd], function (err, results) {
                        if (err) throw err;
                        res.status(200).send(results);
                    });
                    break;
            }
        } catch (error) {
            res.status(203).send(error)
        }
    })

    /************ Get all info in caroussel Table  **************/
    await app.get("/caroussel/", function (req, res) {
        try {
            connection.query(carouselSql.getAll, function (err, results) {
                if (err) throw err;
                res.send(results);
            });
        } catch (error) {
            res.status(203).send(error)
        }
    })

    /************ delete image with this filename in DB and in folder **************/
    await app.delete("/caroussel/:filename", auth, function (req, res) {
        try {
            const filename = req.params.filename;
            connection.query(carouselSql.deleteImg, [filename], function (err, results) {
                if (err) throw err;
                // handle unknown user
                if (results.affectedRows > 0) {
                    res.status(200).send("image removed");
                    const path = `./src/assets/uploads/images/caroussel/${filename}`
                    //file removed
                    fs.unlink(path, (err) => {
                        if (err) {
                            throw (err)
                        }
                    })
                } else {
                    res.status(203).send("image unknown");
                }
            });
        } catch (error) {
            res.status(203).send(error)
        }
    });

}
module.exports = carousselRouter;