const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    if(!req.body.username || !req.body.password) {
        return res.json({ status: 400, message: 'Username or password is required' });
    }
    try {
        const { username, password } = req.body;
        const foundedUser = await User.findOne({ username: username });
        if( !foundedUser) {
            return res.json({ status: 401, message: 'Username is invalid' });
        }
        const match = await bcrypt.compare(password, foundedUser.password);
        if( !match ) {
            return res.json({ status: 401, message: 'Password is invalid' });
        } else {
            const roles = Object.values(foundedUser.roles).filter(Boolean);
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: foundedUser.username,
                        roles: roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: '5m'}
            )
            const refreshToken = jwt.sign(
                { username: foundedUser.username },
                process.env.REFRESH_TOKEN_SECRET_KEY,
                { expiresIn: '1d'}
            )
            foundedUser.refreshToken = refreshToken;
            const result = await foundedUser.save();
            if(!result) {
                return res.json({ status: 500, message: 'Something went wrong'});
            }
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                maxAge: 24 * 60 * 60 * 1000
            })
            res.json({ status: 200, roles: roles, accessToken: accessToken});
        }

    } catch (e) {
        return res.json({ status: 400, message: e.message });
    }
};

module.exports = { handleLogin };