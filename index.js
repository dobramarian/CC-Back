const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const messagesRouter = require('./router/messagesRouter');
const utilsRouter = require('./router/utilsRouter');

const app = express();
app.use(cors());

// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.use("/messages", messagesRouter);
app.use("/utils", utilsRouter);

const port = process.env.PORT || 8082;

app.listen(port, () => {
    console.log(`CC app listening on port ${port}!`)
});