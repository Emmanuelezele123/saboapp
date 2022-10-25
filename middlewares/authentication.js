
const { decodeToken } = require('../helpers/jwtService')
exports.authenticateUser = (req, res, next) => {
    // check if there is an authorization token
    if (!req.headers.authorization) {
        return res.status(401).json({message: "authorization header required"})
    }
    let splittedHeader = req.headers.authorization.split(' ')
    if (splittedHeader[0] !== 'Bearer') {
        return res.status(401).json({message: "authorization format is Bearer <token>"})
    }
    // decode token
    let token = splittedHeader[1]
    let decodedToken = decodeToken(token)
    // check if token is valid
    if (!decodedToken) {
        return res.status(401).json({message: "You are not logged in to access this route"})
    } else {
        // allow user to continue with the request
        req.user = decodedToken
        console.log(req.user)
        next()
    }
    
}