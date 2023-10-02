
const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.roles) {
            return res.json({ status: 401 })
        }
        const result = req.roles.map(role => allowedRoles.includes(role)).find(val => val===true);
        if(!result) {
            return res.json({status: 401});
        }
        next()
    }
}

module.exports = verifyRoles;