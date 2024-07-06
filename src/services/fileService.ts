import csv from 'csv-parser';
import fs from 'fs';
import crypto from 'crypto';

let uploadedFileHash: string | null | undefined = null;
let csvData: any[] = [];

interface UploadedFile {
    hash: string;
    name: string;
}

let uploadedFiles: UploadedFile[] = [];

function generateFileHash(filePath: string, callback: (err: Error | null, fileHash?: string) => void) {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => {
        hash.update(data);
    });

    stream.on('end', () => {
        callback(null, hash.digest('hex'));
    });

    stream.on('error', (err) => {
        callback(err);
    });
}

export function checkForDuplicateFile(filePath: string, callback: (err: Error | null, isDuplicate?: boolean) => void) {
    generateFileHash(filePath, (err, fileHash) => {
        if (err) {
            return callback(err);
        }

        const fileName = filePath.split('/').pop();

        const isDuplicate = uploadedFiles.some(file => file.name === fileName && file.hash === fileHash);

        if (isDuplicate) {
            return callback(null, true);
        }

        uploadedFiles.push({ hash: fileHash!, name: fileName! });
        return callback(null, false);
    });
}

export function uploadService(filePath: string) {
    return new Promise<void>((resolve, reject) => {
        const newCsvData: any[] = [];

        const fileStream = fs.createReadStream(filePath);

        const parser = fileStream.pipe(csv({ separator: ',' }));

        parser.once('headers', (headers: string[]) => {
            if (headers.length == 1 && headers[0].includes(';')) {
                reject(new Error('Invalid CSV format: Incorrect delimiter used.'));
            }
        });

        parser.on('data', (row: any) => {
            newCsvData.push(row);
        });

        parser.on('end', () => {
            if (newCsvData.length === 0) {
                reject(new Error('Empty CSV file: No data found.'));
            } else {
                csvData = newCsvData;
                resolve();
            }
        });

        fileStream.on('error', (error) => {
            reject(error);
        });
    });
};

export function getCsvData() {
    return csvData;
};
