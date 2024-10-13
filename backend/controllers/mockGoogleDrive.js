
const fs = require('fs');
const path = require('path');


class MockGoogleDriveAPI {
    constructor(localStoragePath) {
        this.localStoragePath = localStoragePath;
        if (!fs.existsSync(this.localStoragePath)) {
            fs.mkdirSync(this.localStoragePath, { recursive: true });
        }
    }

    async uploadExcelFile(filePath, fileName) {
        try {
            const destPath = path.join(this.localStoragePath, fileName);
            await fs.promises.copyFile(filePath, destPath);
            const fileId = Buffer.from(destPath).toString('base64');
            console.log(`Excel file uploaded: ${fileName} (ID: ${fileId})`);
            return { id: fileId, name: fileName, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
        } catch (error) {
            console.error('Error uploading Excel file:', error);
            throw error;
        }
    }

    async downloadExcelFile(fileId, destPath) {
        try {
            const sourcePath = Buffer.from(fileId, 'base64').toString();
            await fs.promises.copyFile(sourcePath, destPath);
            console.log(`Excel file downloaded: ${fileId} to ${destPath}`);
        } catch (error) {
            console.error('Error downloading Excel file:', error);
            throw error;
        }
    }

    async deleteExcelFile(fileId) {
        try {
            const filePath = Buffer.from(fileId, 'base64').toString();
            await fs.promises.unlink(filePath);
            console.log(`Excel file deleted: ${fileId}`);
        } catch (error) {
            console.error('Error deleting Excel file:', error);
            throw error;
        }
    }

    async listExcelFiles() {
        try {
            const files = await fs.promises.readdir(this.localStoragePath);
            return files
            .filter(file => path.extname(file).toLowerCase() === '.xlsx')
            .map(file => ({
                id: Buffer.from(path.join(this.localStoragePath, file)).toString('base64'),
                name: file,
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }));
        } catch (error) {
            console.error('Error listing Excel files:', error);
            throw error;
        }
    }
}
exports.mockDrive  = new MockGoogleDriveAPI('../mock_google_drive');   