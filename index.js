import express from 'express'
import authRoutes from './src/routes/authRoutes.js'
import { initializeDb } from './src/db/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cookieParser());

initializeDb();

app.get('/',async (req,res) => {
  res.send('app is healty')
})

app.use('', authRoutes)

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});