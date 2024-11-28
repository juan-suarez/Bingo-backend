import express from 'express'

const routes = express.Router();

routes.get('/protected', (req, res, next) => {

  res.send('route protected, you are authorized!');
})

routes.post('/login',(req, res) => {

  res.send('you are loged in!');
})

routes.post('/register',(req, res) => {

  res.send('you are registed!');
})

export default routes;