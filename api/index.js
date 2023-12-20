const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const config = require("../config");

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

// Connect database
const connectionString = process.env.CONNECTIONSTRING;
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
    const userDoc = await User.findOne({ email });

    if (userDoc) {
      // compare password from request body with password from database
      const passwordMatch = await bcrypt.compare(password, userDoc.password);
      const secretKey = process.env.SECRET_KEY;

      if (passwordMatch) {
        jwt.sign(
          {
            email: userDoc.email,
            id: userDoc._id,
          },
          secretKey,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json("Credenciales validas");
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

app.listen(4000);
