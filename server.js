const express = require("express");
const bodyParser = require("body-parser");
const myRouter = require("./routes/router");
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// Add middleware to parse incoming JSON data
app.use(bodyParser.json());
app.use(myRouter);
app.use(cors());

app.listen(3001, () => {
  console.log(`seerver started on port 3001`);
});
