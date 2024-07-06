import { Request, Response } from 'express';
import { getCsvData } from '../services/fileService';

export function getUsers(req: Request, res: Response) {
    try {
        const searchQuery = req.query.q ? req.query.q.toString().toLowerCase() : '';
        const field = req.query.field ? req.query.field.toString() : '';
        const csvData = getCsvData()

        if (!searchQuery) {
            return res.json({ data: csvData });
        }

        let filteredData;

        if (field && csvData.length > 0 && csvData[0][field]) {
            filteredData = csvData.filter(item =>
                typeof item[field] === 'string' &&
                item[field].toLowerCase().includes(searchQuery)
            );
        } else {
            filteredData = csvData.filter(item =>
                Object.values(item).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(searchQuery)
                )
            );
        }

        return res.status(200).json({ data: filteredData });
    } catch (error) {
        console.error('Error handling /api/users request:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
