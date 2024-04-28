require("dotenv").config();
// app.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const db = require("./models");
app.set("view engine", "jade");
app.use(bodyParser.json());
app.use(cookieParser()); // Use cookie-parser
//add public folder with dirname
app.use(express.static(__dirname + "/public"));
app.use(express.static("css"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", require("./routes/router"));

const PORT = process.env.PORT || 3000;
db.sequelize
  .sync()
  .then(() => {
    //log connected to database message
    console.log("Connected to the database.");
    //start the server

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database: ", err);
  });
