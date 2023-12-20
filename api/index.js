const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
/* `require("dotenv").config();` is a method used to load environment variables from a `.env` file into
the Node.js process. The `.env` file contains key-value pairs of environment variables that are
specific to the application. By calling `require("dotenv").config();`, the application can access
these environment variables using `process.env.VARIABLE_NAME`. */
require("dotenv").config();
// const config = require("../config");

const app = express();
/* `app.use(express.json())` is a middleware function that parses incoming requests with JSON payloads.
It allows the server to handle JSON data sent in the request body. */
app.use(express.json());
/* The line `app.use(cors({ credentials: true, origin: "http://localhost:5173" }));` is configuring
Cross-Origin Resource Sharing (CORS) for the Express application. */
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
/* `app.use(cookieParser());` is a middleware function that parses cookies attached to the incoming
requests. It allows the server to access and manipulate cookies sent by the client. After parsing,
the cookie data is available in the `req.cookies` object, which can be accessed in subsequent
middleware or route handlers. */
app.use(cookieParser());

// Connect database
const connectionString = process.env.CONNECTIONSTRING;
const secretKey = process.env.SECRET_KEY;
mongoose.connect(connectionString);
// const connectionString = config.database.CONNECTIONSTRING;
// mongoose.connect(connectionString);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (error) {
    res.status(422).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    /* `const userDoc = await User.findOne({ email });` is querying the database to find a user
    document that matches the provided email. It uses the `findOne()` method of the `User` model to
    search for a document in the `User` collection where the `email` field matches the provided
    email. The result is stored in the `userDoc` variable. */
    const userDoc = await User.findOne({ email });

    if (userDoc) {
      // compare password from request body with password from database
      const passwordMatch = await bcrypt.compare(password, userDoc.password);

      if (passwordMatch) {
        /* The `jwt.sign()` function is used to generate a JSON Web Token (JWT) for authentication
      purposes. */
        jwt.sign(
          {
            email: userDoc.email,
            id: userDoc._id,
          },
          secretKey,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        res.status(422).json("Credenciales invalidas");
      }
    } else {
      res.json("User not found");
    }
  } catch (error) {
    res.status(422).json(error);
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, secretKey, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.listen(4000);
