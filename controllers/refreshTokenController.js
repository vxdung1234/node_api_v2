const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    try {
        const cookie = req.cookies;
        if(!cookie.jwt) {
            return res.json({status: 403});
        }
        const refreshToken = cookie.jwt;
        const foundUser = await User.findOne({refreshToken: refreshToken}).exec();
        if(!foundUser) {
            return res.json({status: 403});
        }
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY,
            (err, decoded) => {
                if(err || decoded.username !== foundUser.username) {
                    return res.json({status: 403});
                }
                const roles = Object.values(foundUser.roles).filter(Boolean);
                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            username: foundUser.username,
                            roles: roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET_KEY,
                    {expiresIn: '5m'}
                );
                return res.json({status: 200, roles: roles, accessToken: accessToken});
            }
        );
    } catch(e) {
        return res.json({ status: 500 });
    }
}

module.exports = { handleRefreshToken };