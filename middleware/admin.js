const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization;
    const words = token.split(" ")
    const jwtToken = words[1]

    try {
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET)
        if (decodedValue) {
            next()
        }
        else {
            res.status(403).json({
                message: "You are not Authenticated"
            })
        }
    } catch (error) {
        res.json({
            msg: 'Incorrect Inputs'
        })
    }
}



module.exports = adminMiddleware;