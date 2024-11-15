const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

class GoogleDriveService {
    constructor() {
        // Path to your service account key file
        this.KEYFILEPATH = path.join(__dirname, '../service-account-key.json');
        this.SCOPES = ['https://www.googleapis.com/auth/drive'];
        
        this.ALLOWED_MIME_TYPES = [
            'application/vnd.ms-excel', // .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        ];
    }

    async authorize() {
        try {
            const auth = new google.auth.GoogleAuth({
                keyFile: this.KEYFILEPATH,
                scopes: this.SCOPES
            });
            return auth;
        } catch (error) {
            console.error('Authorization Error:', error);
            throw new Error('Failed to authorize with Google Drive');
        }
    }

    validateExcelFile(filePath) {
        const extension = path.extname(filePath).toLowerCase();
        if (!['.xlsx', '.xls'].includes(extension)) {
            throw new Error('Invalid file type. Only Excel files (.xlsx, .xls) are allowed');
        }

        if (!fs.existsSync(filePath)) {
            throw new Error('File does not exist');
        }

        const stats = fs.statSync(filePath);
        const fileSizeInMB = stats.size / (1024 * 1024);
        if (fileSizeInMB > 10) {
            throw new Error('File size exceeds 10MB limit');
        }
    }

    getMimeType(filePath) {
        const extension = path.extname(filePath).toLowerCase();
        return extension === '.xlsx' 
            ? 'application/vnd.ms-excel'
            : 'application/vnd.ms-excel';
    }

    async uploadExcelFile(filePath, fileName, folderId) {
        try {
            this.validateExcelFile(filePath);
            
            const auth = await this.authorize();
            const drive = google.drive({ version: 'v3', auth });

            const fileMetadata = {
              name: fileName.endsWith('.xlsx') || fileName.endsWith('.xls') 
              ? fileName 
              : `${fileName}.xlsx`,
              parents: [folderId],  // Specify the parent folder ID
            };

            const media = {
                mimeType: this.getMimeType(filePath),
                body: fs.createReadStream(filePath)
            };

            const file = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id, name, webViewLink, mimeType',
                supportsAllDrives: true
            });

            // Make the file accessible via link
            await drive.permissions.create({
                fileId: file.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });

            return {
                success: true,
                fileId: file.data.id,
                fileName: file.data.name,
                webViewLink: file.data.webViewLink,
                mimeType: file.data.mimeType
            };

        } catch (error) {
            console.error('Upload Error:', error);
            throw new Error(`Failed to upload Excel file: ${error.message}`);
        }
    }

    async listExcelFiles(folderId = null, pageSize = 10) {
        try {
            const auth = await this.authorize();
            const drive = google.drive({ version: 'v3', auth });

            let query = this.ALLOWED_MIME_TYPES.map(mimeType => 
                `mimeType='${mimeType}'`
            ).join(' or ');

            if (folderId) {
                query = `(${query}) and '${folderId}' in parents`;
            }

            const response = await drive.files.list({
                pageSize: pageSize,
                fields: 'files(id, name, mimeType, webViewLink, createdTime, size)',
                q: query,
                orderBy: 'createdTime desc'
            });

            return {
                success: true,
                files: response.data.files.map(file => ({
                    id: file.id,
                    name: file.name,
                    mimeType: file.mimeType,
                    webViewLink: file.webViewLink,
                    createdTime: file.createdTime,
                    size: file.size
                }))
            };

        } catch (error) {
            console.error('List Files Error:', error);
            throw new Error('Failed to list Excel files from Google Drive');
        }
    }

    async createFolder(folderName, parentFolderId = null) {
        try {
            const auth = await this.authorize();
            const drive = google.drive({ version: 'v3', auth });

            const folderMetadata = {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                ...(parentFolderId && { parents: [parentFolderId] })
            };

            const folder = await drive.files.create({
                resource: folderMetadata,
                fields: 'id, name'
            });

            // Make folder accessible via link
            await drive.permissions.create({
                fileId: folder.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });

            return {
                success: true,
                folderId: folder.data.id,
                folderName: folder.data.name
            };

        } catch (error) {
            console.error('Create Folder Error:', error);
            throw new Error('Failed to create folder in Google Drive');
        }
    }

    async deleteFile(fileId) {
        try {
            const auth = await this.authorize();
            const drive = google.drive({ version: 'v3', auth });

            await drive.files.delete({
                fileId: fileId
            });

            return {
                success: true,
                message: 'Excel file deleted successfully'
            };

        } catch (error) {
            console.error('Delete Error:', error);
            throw new Error('Failed to delete file from Google Drive');
        }
    }
}

module.exports.driveService = new GoogleDriveService();