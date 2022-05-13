const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const messagesRouter = require("./messageRouter/messagesRouter");

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/messages",messagesRouter);

const port = process.env.PORT || 8081;

// app.get('/', (req, res) => {
//     res.send('Hello World again1!')
//   });
  
  app.listen(port, () => {
    console.log(`CC app is listening on port ${port}!`)
  });