import express from 'express'
import { createUser } from '../controller/userController.js';

const routes = express.Router();

routes.get('/protected', (req, res, next) => {

  res.send('route protected, you are authorized!');
})

routes.post('/login',(req, res) => {

  res.send('you are loged in!');
})

routes.post('/register', createUser)

export default routes;