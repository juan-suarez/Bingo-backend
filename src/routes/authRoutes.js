import express from 'express'
import { createUser, loginUser } from '../controller/userController.js';
import { authenticateToken } from '../controller/verifyTóken.js';

const routes = express.Router();

routes.get('/protected', authenticateToken,(req, res) => {

  res.status(200).send('ruta protegida, acceso permitido!');
})

routes.post('/login',loginUser)

routes.post('/register', createUser)

export default routes;