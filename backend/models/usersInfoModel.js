const mongoose = require('mongoose');
/**
 * age 
 *       dateOfBirth: ['', Validators.required], date

 */
const UsersInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    gender: {  // used for plan calculation
        type: String,
        require: true,
        enum: ['male', 'female'],
    },
    dateOfBirth: {
        type: Date,
        require: true
    },
    height:{
        type: Number,
        require: true
    },
    fitnessFavPlan: { // used for plan calculation
        type: String,
        enum: ['pushPullLeg', 'fullBody', 'upperLower', 'upper', 'lower', 'other'],
    },
    fitnessFavPlanOther: {
        type: String,
    },
    fitnessGoal: { // used for plan calculation
        type: String,
        require: true,
        enum: ['athleticPerformance', 'muscleBuilding', 'strengthAndMuscle'],
    },
    fitnessGoalText: { 
        type: String,
    },
    fitnessLevel: {
        type: String,
        require: true
    },
    workoutLocation: {  // used for plan calculation
        type: String,
        require: true,
        enum: ['home', 'gym'],
    },
    homeEquipment:  {
        type: String,
    },
    workoutDaysPerWeek: {  // used for plan calculation
        type: Number,
        require: true,
        enum: [3, 4, 5, 6],
    },
    workoutHoursPerDay: {
        type: String,
        require: true
    }, 
    preferredWorkoutDays: {
        type: [String],
        require: true
    },
    currentOccupation: {
        type: String,
    },
    jobNature: {
        type: String,
        require: true
    },
    previousExperience: {
        type: String,
        require: true
    },
    chronicDiseases: {
        type: String,
    },
    injuries: {
        type: String,
    },
    supplements: {
        type: String,
    },
    mealPreparation:  {
        type: String,
        require: true
    },
    dietMethod: {
        type: String,
    },
    dailyDiet: {
        type: String,
        require: true
    },
    foodAllergies: {
        type: String,
    },
    favoriteFoods: {
        type: String,
    },
    squatRating: {
        type: Number,
        require: true
    },
    deadliftRating: {
        type: Number,
        require: true
    },
    benchPressRating: {
        type: Number,
        require: true
    },
    pullUpRating: {
        type: Number,
        require: true
    },
    additionalInfo:  {
        type: String,
    },
    referralSource:  {
        type: String,
        require: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FilePlan"
    },
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer"
    }
}, {timestamps: true});

module.exports = mongoose.model('UsersInfo', UsersInfoSchema);