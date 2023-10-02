const jwt = require('jsonwebtoken');

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader.startsWith('Bearer ')) {
        return res.json({status: 401});
    }
    const accessToken = authHeader.split(' ')[1];
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET_KEY,
        (err, decoded) => {
            if(err) {
                return res.json({status: 401})
            }
            req.username = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    )
}

module.exports = verifyJWT;