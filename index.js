import express from 'express'
import authRoutes from './src/auth/authRoutes.js'

const app = express();

const port = process.env.PORT ?? 3000;

app.get('/',async (req,res) => {
  res.send('app is healty')
})

app.use('', authRoutes)

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});