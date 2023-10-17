//requiring the dotenv file inside our project
require("dotenv").config();

//Creating express application
const express = require("express");
//Requiring ejs layout
const expressLayout = require("express-ejs-layouts");
//Requiring methodOverride which allows us to use PUT and DELETE
const methodOverride = require("method-override");

/*Used to save the cookies which are used to store the session 
when we login and thus we dont have to login everytime*/
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session");

//Importing the connectDB function from db.js
const connectDB = require("./server/config/db");

const app = express();

const PORT = process.env.PORT || 5000;

//Middlewares for parsing data

//For parsing the data submitted by a form etc.
app.use(express.urlencoded({ extended: false }));
//To parse json data
app.use(express.json());

app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

//Connecting to DB
// connectDB();
app.use(express.static("public"));

//Using the expressLayout
app.use(expressLayout);

//Methode ovveride
app.use(methodOverride("_method"));

//Creating main layout and setting the templating engine
app.set("layout", "./layouts/main");

//Setting ejs as default engine

app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
