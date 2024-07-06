"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = uploadFile;
const fileService_1 = require("../services/fileService");
function uploadFile(req, res) {
    const { file } = req;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    (0, fileService_1.checkForDuplicateFile)(file.path, (err, isDuplicate) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'File upload failed' });
        }
        if (isDuplicate) {
            return res.status(409).json({ message: 'File already uploaded' });
        }
        (0, fileService_1.uploadService)(file.path)
            .then(() => {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
            res.status(200).json({ message: 'File uploaded successfully' });
        })
            .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'File upload failed' });
        });
    });
}
;
