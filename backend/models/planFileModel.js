const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    workoutDaysPerWeek: {
        type: Number,
        required: true
    },
    workoutLocation: {
        type: String,
        required: true 
    },
    gender: {
        type: String,
        required: true
    },
    fitnessGoal: {
        type: String
    },
    fitnessFavPlan: {
        type: String,
    },
    
});

module.exports = mongoose.model('Plan', PlanSchema);