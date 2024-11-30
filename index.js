import express from 'express'
import { createServer } from 'http';
import authRoutes from './src/routes/authRoutes.js'
import { initializeDb } from './src/db/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { authenticateToken } from './src/controller/verifyToken.js';
import { handleWebSocket } from './src/controller/webSocketHandler.js';

dotenv.config();
const app = express();

const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cookieParser());

initializeDb();

app.get('/',authenticateToken,async (req,res) => {
  res.send('app is healty')
})

const server = createServer(app);
handleWebSocket(server);

app.use('', authRoutes)

server.listen(port, () => {
  console.log(`server running on port: ${port}`);
});