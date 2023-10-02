const Employee = require('../models/Employee');

const getEmployee = async (req, res) => {
    try {
        if(!req.params?.id) {
            return res.json({status: 400 ,message: 'ID is required'});
        }
        const employee = await Employee.findOne({_id: req.params.id});
        if(!employee) {
            return res.json({status: 204})
        }
        res.json({status: 200, data: employee})
    } catch (e) {
        res.json({status: 500, message: e.message});
    }
}

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().exec();
        if (!employees) {
            return res.json({ status: 204 });
        }
        res.json({ status: 200, data: employees });
    } catch (e) {
        return res.json({ status: 500 });
    }
}

const createEmployee = async (req, res) => {
    try {
        if(!req.body?.firstname || !req.body?.lastname) {
            return res.json({status: 400, message: 'First name and last name are required'});
        }
        const {firstname, lastname } = req.body;
        const result = await Employee.create({
            firstname: firstname,
            lastname: lastname
        });
        if(!result) {
            return res.json({status: 500})
        }
        res.json({status: 200, message: `${firstname} ${lastname} has created`});
    } catch(e) {
        res.json({status: 500, message: e.message});
    }
}

const updateEmployee = async (req, res) => {
    try {
        if(!req.body?.id) {
            return res.json({status: 400, message: 'ID is required'});
        }
        const id = req.body.id;
        const foundEmployee = await Employee.findOne({_id: id}).exec();
        if(!foundEmployee) {
            return res.json({status: 403})
        }
        if(req.body.firstname) {
            foundEmployee.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
            foundEmployee.lastname = req.body.lastname;
        }
        const result = await foundEmployee.save();
        if(!result) {
            res.json({status:500});
        }
        res.json({status: 200, message: `Employee has update`});
    } catch(e) {
        res.json({status: 500, message: e.message});
    }
}

const deleteEmployee = async (req, res) => {
    try {
        if(!req.params?.id) {
            return res.json({status: 400 ,message: 'ID is required'});
        }
        const employee = await Employee.findOne({_id: req.params.id});
        if(!employee) {
            return res.json({status: 204})
        }
        const result = await employee.deleteOne();
        if(!result) {
            return res.json({status: 500})
        }
        res.json({status: 200, message: `${employee.firstname} ${employee.lastname} has deleted`});
    } catch (e) {
        res.json({status: 500, message: e.message});
    }
}

module.exports = {
    getEmployee,
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
}
