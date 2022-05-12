const express = require('express');
const cors = require('cors');

const app = express()
app.use(cors());

const port = process.env.PORT || 8081;

app.get('/', (req, res) => {
    res.send('Hello World again1!')
  });
  
  app.listen(port, () => {
    console.log(`CC app is listening on port ${port}!`)
  });