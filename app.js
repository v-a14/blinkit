const express = require('express');
const path = require('path'); // Ensure path is imported
const app = express();

const indexRouter = require('./routes/index');
const authRouter = require("./routes/auth");
const morgan = require("morgan");
const expressSession = require("express-session");

require("dotenv").config();
require("./config/db");
require("./config/google_auth_config");

app.use(morgan("dev"));
app.set("view engine", "ejs"); // Corrected this line
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add session middleware with proper options
app.use(
  expressSession({
    secret: "Vaibhav",  // replace with your own secret
    resave: false,               // don't force session to be saved back to the store
    saveUninitialized: false,    // don't save uninitialized sessions
  })
);

app.use("/", indexRouter);
app.use("/auth", authRouter);

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
