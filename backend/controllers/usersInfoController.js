// controllers/recordController.js
const UserInfo = require('../models/usersInfo');
const { choosetheCorrectPlan } = require("./planFileController");
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
    const userInfoData = req.body;
    try {
        const newUserInfo = new UserInfo({...userInfoData});
        const chosenPlan = await choosetheCorrectPlan(newUserInfo.workoutDaysPerWeek, newUserInfo.gender, newUserInfo.workoutLocation);
        console.log(newUserInfo.workoutDaysPerWeek, newUserInfo.gender, newUserInfo.workoutDaysPerWeek);
        console.log(chosenPlan);
        
        if (chosenPlan) newUserInfo.planId = chosenPlan._id; 
        await newUserInfo.save();
        res.status(201).json(newUserInfo);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}