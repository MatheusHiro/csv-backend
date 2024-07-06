import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/usersRoutes';
import filesRoutes from './routes/filesRoutes';
import uploads from './upload';

const app = express();
const port = 3000;

app.use(cors());
app.use('/api/users', usersRoutes);
app.use('/api/files', uploads.single('file'), filesRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
