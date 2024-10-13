// controllers/recordController.js
const UserInfo = require('../models/usersInfo');
const { choosetheCorrectPlan } = require("./planFileController");
const { mockDrive } = require("./mockGoogleDrive");
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
        const newUserInfo = new UserInfo({...userInfoData});
        const chosenPlan = await choosetheCorrectPlan(newUserInfo.workoutDaysPerWeek, newUserInfo.gender, newUserInfo.workoutLocation);
        if (chosenPlan) {
            newUserInfo.planId = chosenPlan._id; 
        } 
        await newUserInfo.save();
        
        if (chosenPlan) {
            uploadUserFile(newUserInfo, prefix + chosenPlan.filePath + '/' + chosenPlan.name + '.xlsx', chosenPlan.name )
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
async  function uploadUserFile(user, filePath, fileName) {
    try {
        // Assume you have a function to interact with your database
        // const user = await getUserById(userId);
        
        // Ensure the file is an Excel file
        // if (path.extname(fileName).toLowerCase() !== '.xlsx') {
        //     console.log("sdfsd", path.extname(fileName).toLowerCase())
        //     console.log("sdfsd", path.extname(fileName).toLowerCase())
        //     throw new Error('Only Excel files (.xlsx) are allowed');
        // }
    
        // Generate a unique filename to avoid conflicts
        const uniqueFileName = `${user.name}_${Date.now()}_${fileName}`;
        
        // Upload Excel file using mock Google Drive API
        const uploadedFile = await mockDrive.uploadExcelFile(filePath, uniqueFileName);
        
        // Save file information to your database
        // await saveFileToDatabase({
        //   id: uploadedFile.id,
        //   originalName: fileName,
        //   userFileName: uploadedFile.name,
        //   mimeType: uploadedFile.mimeType,
        //   userId: user.id,
        //   uploadDate: new Date()
        // });
    
        console.log(`File uploaded successfully: ${uploadedFile.name}`);
        return uploadedFile;
    } catch (error) {
        console.error('Error in uploadUserFile:', error);
        throw error;
    }
}

// with excelJS
// const ExcelJS = require('exceljs');

// class MockGoogleDriveAPI {
//   constructor(localStoragePath) {
//     this.localStoragePath = localStoragePath;
//     if (!fs.existsSync(this.localStoragePath)) {
//       fs.mkdirSync(this.localStoragePath, { recursive: true });
//     }
//   }

//   async uploadExcelFile(filePath, fileName) {
//     try {
//       const destPath = path.join(this.localStoragePath, fileName);
//       await fs.promises.copyFile(filePath, destPath);
//       const fileId = Buffer.from(destPath).toString('base64');
//       console.log(`Excel file uploaded: ${fileName} (ID: ${fileId})`);
//       return { id: fileId, name: fileName, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
//     } catch (error) {
//       console.error('Error uploading Excel file:', error);
//       throw error;
//     }
//   }

//   async downloadExcelFile(fileId, destPath) {
//     try {
//       const sourcePath = Buffer.from(fileId, 'base64').toString();
//       await fs.promises.copyFile(sourcePath, destPath);
//       console.log(`Excel file downloaded: ${fileId} to ${destPath}`);
//     } catch (error) {
//       console.error('Error downloading Excel file:', error);
//       throw error;
//     }
//   }

//   async deleteExcelFile(fileId) {
//     try {
//       const filePath = Buffer.from(fileId, 'base64').toString();
//       await fs.promises.unlink(filePath);
//       console.log(`Excel file deleted: ${fileId}`);
//     } catch (error) {
//       console.error('Error deleting Excel file:', error);
//       throw error;
//     }
//   }

//   async listExcelFiles() {
//     try {
//       const files = await fs.promises.readdir(this.localStoragePath);
//       return files
//         .filter(file => path.extname(file).toLowerCase() === '.xlsx')
//         .map(file => ({
//           id: Buffer.from(path.join(this.localStoragePath, file)).toString('base64'),
//           name: file,
//           mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         }));
//     } catch (error) {
//       console.error('Error listing Excel files:', error);
//       throw error;
//     }
//   }

//   async readExcelFile(fileId) {
//     try {
//       const filePath = Buffer.from(fileId, 'base64').toString();
//       const workbook = new ExcelJS.Workbook();
//       await workbook.xlsx.readFile(filePath);
//       const worksheet = workbook.getWorksheet(1);
//       const data = [];
//       worksheet.eachRow((row, rowNumber) => {
//         data.push(row.values.slice(1));
//       });
//       return data;
//     } catch (error) {
//       console.error('Error reading Excel file:', error);
//       throw error;
//     }
//   }

//   async updateExcelFile(fileId, data) {
//     try {
//       const filePath = Buffer.from(fileId, 'base64').toString();
//       const workbook = new ExcelJS.Workbook();
//       await workbook.xlsx.readFile(filePath);
//       const worksheet = workbook.getWorksheet(1);
//       data.forEach((row, rowIndex) => {
//         row.forEach((cellValue, colIndex) => {
//           worksheet.getCell(rowIndex + 1, colIndex + 1).value = cellValue;
//         });
//       });
//       await workbook.xlsx.writeFile(filePath);
//       console.log(`Excel file updated: ${fileId}`);
//     } catch (error) {
//       console.error('Error updating Excel file:', error);
//       throw error;
//     }
//   }
// }
