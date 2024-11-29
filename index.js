import express from 'express'
import authRoutes from './src/routes/authRoutes.js'
import { initializeDb } from './src/db/db.js';

const app = express();

const port = process.env.PORT ?? 3000;

app.use(express.json());

initializeDb();

app.get('/',async (req,res) => {
  res.send('app is healty')
})

app.use('', authRoutes)

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});