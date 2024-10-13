const PlanFileModel = require("../models/planFileModel");
const fs = require('fs');
const path = require('path');

exports.getPlan = async (req, res) => {
    const planId = req.params.planId;
    try {
        const plan = await PlanFileModel.findOne({ _id: planId });
        res.status(200).json(plan);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}
exports.getAllPlan = async (req, res) => {
    try {
        const plans = await PlanFileModel.find();
        res.status(200).json(plans);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}
exports.addMultiplePlan = async (req, res) => {
    try {
        const plans  = req.body;
        const plansResponse = await PlanFileModel.insertMany(plans);
        res.status(201).json(plansResponse);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}
/**
 * The Correct Chose For plan based On User Selection
 */
exports.choosetheCorrectPlan = async (workoutDaysPerWeek, gender, workoutLocation) => {
    const chosenPlan = await PlanFileModel.findOne({workoutDaysPerWeek , gender, workoutLocation});
    return chosenPlan;
}

