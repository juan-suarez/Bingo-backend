import express from 'express'

const app = express();

const port = process.env.PORT ?? 3000;

app.get('/',async (req,res) => {
  res.send('app is healty')
})


app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});