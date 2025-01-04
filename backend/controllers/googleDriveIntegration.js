const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

class GoogleDriveService {
    constructor() {
        // Path to your service account key file
        // this.KEYFILEPATH = path.join(__dirname, '../delhi-cred.json');
        this.SCOPES = ['https://www.googleapis.com/auth/drive'];
        const credentials = JSON.parse(
            Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString()
        );
        this.credentials = credentials;
        this.ALLOWED_MIME_TYPES = [
            'application/vnd.ms-excel', // .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        ];
    }

    async authorize() {
        try {
            const auth = new google.auth.GoogleAuth({
                // keyFile: this.KEYFILEPATH,
                credentials: this.credentials,
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

    validatePDFFile(guideFilePath) {
        // Validate PDF file
        const extension = path.extname(guideFilePath).toLowerCase();
        if (extension !== '.pdf') {
            throw new Error('Invalid file type. Only PDF files (.pdf) are allowed');
        }

        if (!fs.existsSync(guideFilePath)) {
            throw new Error('File does not exist');
        }

        const stats = fs.statSync(guideFilePath);
        const fileSizeInMB = stats.size / (1024 * 1024);
        if (fileSizeInMB > 10) {
            throw new Error('File size exceeds 10MB limit');
        }
}
    getMimeType(filePath) {
        const extension = path.extname(filePath).toLowerCase();
        switch (extension) {
            case '.xlsx':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            case '.xls':
                return 'application/vnd.ms-excel';
            case '.pdf':
                return 'application/pdf';
            default:
                throw new Error('Unsupported file type');
        }
    }

    async uploadWithRetry(operation, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                if (attempt === maxRetries) throw error;
                const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    async uploadExcelAndGuideFile(filePath, fileName, folderId, guideFilePath, guideFileName) {
        const uploadedFiles = [];

        try {
            this.validateExcelFile(filePath);


            this.validatePDFFile(guideFilePath);

            const auth = await this.authorize();
            const drive = google.drive({ version: 'v3', auth });


            // Upload PDF with retry
            const pdfResult = await this.uploadWithRetry(() => 
                this.uploadGuidePDfFile(drive, guideFilePath, guideFileName, folderId)
            );
            // Upload Excel with retry
            const excelResult = await this.uploadWithRetry(async () => {
                const fileMetadata = {
                    name: fileName.endsWith('.xlsx') || fileName.endsWith('.xls') 
                        ? fileName 
                        : `${fileName}.xlsx`,
                    parents: [folderId],
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

                await drive.permissions.create({
                    fileId: file.data.id,
                    requestBody: {
                        role: 'reader',
                        type: 'anyone'
                    }
                });

                return file;
            });

            uploadedFiles.push(pdfResult.fileId);
            uploadedFiles.push(excelResult.data.id);
            return {
                success: true,
                fileId: excelResult.data.id,
                fileName: excelResult.data.name,
                webViewLink: excelResult.data.webViewLink,
                mimeType: excelResult.data.mimeType,
                pdf: pdfResult
            };

        } catch (error) {
            // Cleanup any uploaded files
            const auth = await this.authorize();
            const drive = google.drive({ version: 'v3', auth });
            
            for (const fileId of uploadedFiles) {
                await this.deleteFileQuietly(drive, fileId);
            }
            
            console.error('Upload Error:', error);
            throw new Error(`Failed to upload Excel file: ${error.message}`);
        }
    }
    async uploadGuidePDfFile(drive, filePath, fileName, folderId) {
        try {
            const fileMetadata = {
                name: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
                parents: [folderId]
            };
    
            const media = {
                mimeType: 'application/pdf',
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
            throw new Error(`Failed to upload PDF file: ${error.message}`);
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
    async deleteFileQuietly(drive, fileId) {
        try {
            await drive.files.delete({ fileId });
        } catch (error) {
            console.error(`Failed to delete file ${fileId}:`, error);
        }
    }
}

module.exports.driveService = new GoogleDriveService();