import { checkForDuplicateFile, uploadService } from '../services/fileService';
import { Request, Response } from 'express';


export function uploadFile(req: Request, res: Response) {
    const { file } = req;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    checkForDuplicateFile(file.path, (err, isDuplicate) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'File upload failed' });
        }

        if (isDuplicate) {
            return res.status(409).json({ message: 'File already uploaded' });
        }

        uploadService(file.path)
            .then(() => {
                res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
                res.status(200).json({ message: 'File uploaded successfully' });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ message: 'File upload failed' });
            });
    });
};
