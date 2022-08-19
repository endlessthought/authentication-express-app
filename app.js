const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require("path")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const logger = require("./util/logger")
const User = require("./db/models/userModel");
const auth = require("./auth");


// require database connection 
const dbConnect = require("./db/dbConnect");
const GLOBAL_CONSTANTS = require("./GLOBAL_CONSTANTS");

// execute database connection 
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ! /public Static Directory
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use("/private", express.static(path.join(__dirname, 'private')));

app.get("/", (request, response, next) => {
  logger.appendLog("Process", "app.js / api");
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.post("/register", (request, response) => {

  logger.appendLog("Process", "app.js / api");

  bcrypt.hash(request.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });
      user.save().then((result) => {
        logger.appendLog("Success", {
          api: "/register",
          message: "User Added",
          data: result
        });
        response.status(201).send({
          message: "User Created Successfully",
          result,
        });
      })
        .catch((error) => {
          logger.appendLog("Error",
            {
              api: "/register",
              message: "Error while saving user"
            }, error.message);
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });

    })
    .catch((error) => {
      logger.appendLog("Error", {
        api: "/register",
        message: "Error in Password hashing."
      }, error.message);
      response.status(500).send({
        message: "Password was not hashed successfully",
        error: error,
      });
    });
});

// login endpoint
app.post("/login", (request, response) => {
  logger.appendLog("Process", {
    api: "/login",
    message: "User Found."
  });

  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {

      logger.appendLog("Process", {
        api: "/login",
        message: "User Found."
      });

      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password matches
          if (!passwordCheck) {

            logger.appendLog("Error", {
              api: "/login",
              message: "Passwords does not match."
            }, error.message);


            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          logger.appendLog("Process", {
            api: "/login",
            message: "Generating JWT."
          });

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            GLOBAL_CONSTANTS.SECRETKEY,
            { expiresIn: "24h" }
          );

          logger.appendLog("Success", {
            api: "/login",
            message: "Login Success.",
            data: token
          });

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          logger.appendLog("Error", {
            api: "/login",
            message: "Passwords does not match."
          }, error.message);


          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((error) => {
      logger.appendLog("Error", {
        api: "/login",
        message: "Email not Found."
      }, error.message);

      response.status(404).send({
        message: "Email not found",
        error,
      });
    });
});

app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

module.exports = app;
