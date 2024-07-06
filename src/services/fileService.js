"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFileHash = generateFileHash;
exports.checkForDuplicateFile = checkForDuplicateFile;
exports.uploadService = uploadService;
exports.getCsvData = getCsvData;
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
let uploadedFileHash = null;
let csvData = [];
function generateFileHash(filePath, callback) {
    const hash = crypto_1.default.createHash('sha256');
    const stream = fs_1.default.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => callback(null, hash.digest('hex')));
    stream.on('error', (err) => callback(err));
}
;
function checkForDuplicateFile(filePath, callback) {
    generateFileHash(filePath, (err, fileHash) => {
        if (err) {
            return callback(err);
        }
        if (uploadedFileHash === fileHash) {
            return callback(null, true);
        }
        uploadedFileHash = fileHash;
        return callback(null, false);
    });
}
;
function uploadService(filePath) {
    return new Promise((resolve, reject) => {
        const newCsvData = [];
        const fileStream = fs_1.default.createReadStream(filePath);
        const parser = fileStream.pipe((0, csv_parser_1.default)({ separator: ',' }));
        parser.once('headers', (headers) => {
            if (headers.length == 1 && headers[0].includes(';')) {
                reject(new Error('Invalid CSV format: Incorrect delimiter used.'));
            }
        });
        parser.on('data', (row) => {
            newCsvData.push(row);
        });
        parser.on('end', () => {
            if (newCsvData.length === 0) {
                reject(new Error('Empty CSV file: No data found.'));
            }
            else {
                csvData = newCsvData;
                resolve();
            }
        });
        fileStream.on('error', (error) => {
            reject(error);
        });
    });
}
;
function getCsvData() {
    return csvData;
}
;
