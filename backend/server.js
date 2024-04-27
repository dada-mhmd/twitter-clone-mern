import express from 'express';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB();
});
