const jwt = require('jsonwebtoken');
const config = require("../modules/config");


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (token == null) throw "No token provided"

    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        throw "Failed to authenticate token"
      }
      req.decoded = decoded
      next()
    })

  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};



