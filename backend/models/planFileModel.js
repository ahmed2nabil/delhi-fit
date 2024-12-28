const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: [
            // 3 days, male
            'fullBody_men_gym',
            'upperFocused_male_gym',
            'powerbuilding_male_gym',
            'fullbody_male_home',
            'powerbuilding_male_home',
            // 3 days, femal
            "fullbody_female_gym",
            "lowerFocused_female_gym",
            "powerbuilding_female_gym",
            "fullbody_female_home",
            "powerbuilding_female_home",
            // 4 days male
            "upperLower_male_gym",
            "upperFocused_male_gym",
            "powerbuilding_male_gym",
            "upperLower_male_home",
            "upperFocused_male_home",
            "powerbuilding_male_home",
            // 4 days female 
            "lowerFocused_female_gym",
            "upperLower_female_gym",
            "mixed_female_gym",
            "upperLower_female_home",
            "lowerFocused_female_home",
            "mixed_female_home",
            // 5 days male
            "fullBody_male_gym",
            "pushPullLeg_male_gym",
            "powerbuilding_male_gym",
            "powerbuilding_pushPullLeg_male_gym",
            "fullBody_male_home",
            "pushPullLeg_male_home",
            "powerbuilding_male_home",
            "powerbuilding_pushPullLeg_male_home",
            // 5 days female
            "fullBody_female_gym",
            "pushPullLeg_female_gym",
            "powerbuilding_female_gym",
            "powerbuilding_pushPullLeg_female_gym",
            "fullBody_female_home",
            "pushPullLeg_female_home",
            "powerbuilding_female_home",
            "powerbuilding_pushPullLeg_female_home",
        ]
    },
    filePath: {
        type: String,
        required: true,
        enum: ['/threeDays', '/fourDays', '/fiveDays'],
    },
    workoutDaysPerWeek: {
        type: Number,
        required: true,
        enum: [3, 4, 5, 6],
    },
    workoutLocation: {
        type: String,
        required: true,
        enum: ['home', 'gym'],
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
    },
    fitnessGoal: {
        type: String,
        required: true,
        enum: ['athleticPerformance', 'muscleBuilding', 'strengthAndMuscle'],
    },
    fitnessFavPlan: {
        type: String,
        enum: ['pushPullLeg', 'fullBody', 'upperLower', 'upper', 'lower', 'other'],
    },
    
});

module.exports = mongoose.model('Plan', PlanSchema);