import express from 'express'
import { createUser, loginUser } from '../controller/userController.js';

const routes = express.Router();

routes.get('/protected', (req, res, next) => {

  res.send('route protected, you are authorized!');
})

routes.post('/login',loginUser)

routes.post('/register', createUser)

export default routes;