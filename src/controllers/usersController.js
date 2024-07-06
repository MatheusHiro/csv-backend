"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
const fileService_1 = require("../services/fileService");
function getUsers(req, res) {
    try {
        const searchQuery = req.query.q ? req.query.q.toString().toLowerCase() : '';
        const field = req.query.field ? req.query.field.toString() : '';
        const csvData = (0, fileService_1.getCsvData)();
        if (!searchQuery) {
            return res.json({ data: csvData });
        }
        let filteredData;
        if (field && csvData.length > 0 && csvData[0][field]) {
            filteredData = csvData.filter(item => typeof item[field] === 'string' &&
                item[field].toLowerCase().includes(searchQuery));
        }
        else {
            filteredData = csvData.filter(item => Object.values(item).some(value => typeof value === 'string' && value.toLowerCase().includes(searchQuery)));
        }
        return res.status(200).json({ data: filteredData });
    }
    catch (error) {
        console.error('Error handling /api/users request:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
;
