const User = require('../models/User');

const handleLogout = async (req, res) => {
    try {
        const cookie = req.cookies;
        if (!cookie.jwt) {
            return res.json({ status: 204 })
        }
        const refreshToken = cookie.jwt;
        const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
        if (!foundUser) {
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'None',
                // secure: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            return res.json({ status: 204 });
        }
        foundUser.refreshToken = '';
        const result = await foundUser.save();
        if (!result) {
            return res.json({ status: 500 })
        }
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            // secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.json({status: 200, message: `${foundUser.username} has logged out`});
    } catch (e) {
        res.json({ status: 500, message: e.message });
    }
};

module.exports = { handleLogout };