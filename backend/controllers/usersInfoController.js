// controllers/recordController.js
const UserInfo = require('../models/usersInfo');

// Fetch all records
exports.getUsersInfo = async (req, res) => {
    try {
        const records = await UserInfo.find();
        res.json(records);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.AddUserInfo = async (req, res) => {

}