// controllers/recordController.js
const UserInfo = require('../models/usersInfoModel');
const TrainerModel = require('../models/trainerModel');
const { choosetheCorrectPlan } = require("./planFileController");
const { driveService } = require("./googleDriveIntegration");
const path = require("path");
const prefix = "./planFileList";
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
        const trainerData = await TrainerModel.findOne({ trainerId: userInfoData.trainerId });
        if (!trainerData || !trainerData.googleDriveFolderId) {
            throw new Error("no trainer found")
        }
        userInfoData.trainerId = trainerData._id;
        const newUserInfo = new UserInfo({...userInfoData});
        const chosenPlan = await choosetheCorrectPlan(newUserInfo.workoutDaysPerWeek, newUserInfo.gender, newUserInfo.workoutLocation, newUserInfo.fitnessGoal, newUserInfo.fitnessFavPlan);
        if (chosenPlan) {
            newUserInfo.planId = chosenPlan._id;
        }

        await newUserInfo.save();
        
        if (chosenPlan) {
            uploadUserFile(newUserInfo, trainerData.googleDriveFolderId, prefix + chosenPlan.filePath + '/' + chosenPlan.name + '.xlsx', chosenPlan.name)
                .then(file => console.log('File uploaded:', file))
                .catch(error => console.error('Upload failed:', error));
        } 

        res.status(201).json(newUserInfo);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

// In your file upload function
async  function uploadUserFile(user, googleDriveFolderId, filePath, fileName) {
    try {
        // Generate a unique filename to avoid conflicts
        const uniqueFileName = `${user.name}_${fileName}_${Date.now()}_.xlsx`;
        
        // Upload Excel file using mock Google Drive API
        const uploadedFile = await driveService.uploadExcelFile(filePath, uniqueFileName, googleDriveFolderId);
        
        // Save file information to your database
        // await saveFileToDatabase({
        //   id: uploadedFile.id,
        //   originalName: fileName,
        //   userFileName: uploadedFile.name,
        //   mimeType: uploadedFile.mimeType,
        //   userId: user.id,
        //   uploadDate: new Date()
        // });
    
        console.log(`File uploaded successfully: ${uploadedFile.fileName}`);
        return uploadedFile;
    } catch (error) {
        console.error('Error in uploadUserFile:', error);
        throw error;
    }
}