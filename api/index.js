const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const Place = require("./models/Place");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
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
app.use("/uploads", express.static(__dirname + "/uploads"));

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

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

/* The code `app.post("/upload-by-link", async (req, res) => { ... })` is defining a route handler for
the HTTP POST request to "/upload-by-link". */
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  /* The code `await imageDownloader.image({ url: link, dest: __dirname + "/uploads/" + newName })` is
using the `imageDownloader` library to download an image from the specified URL and save it to the
server's `/uploads` directory with a new name. */
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

/* The line `const photosMiddleware = multer({ dest: "uploads" });` is creating a middleware function
using the `multer` library. This middleware function is responsible for handling file uploads. */
const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  jwt.verify(token, secretKey, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get("/places", (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, secretKey, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

/* The code `app.put("/places/:id", async (req, res) => { ... })` is defining a route handler for the
HTTP PUT request to "/places/:id". This route is used to update a specific place document in the
database. */
app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;

  jwt.verify(token, secretKey, {}, async (err, userData) => {
    if (err) {
      // Return error response if token verification fails
      return res.status(401).json({ message: "Invalid token" });
    }
    // Find the placeDoc by id
    const placeDoc = await Place.findById(id);

    // Check if the current user is the owner of the place
    if (userData.id === placeDoc.owner.toString()) {
      // Update the place document with new data
      placeDoc.set({
        owner: userData.id,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
      });

      // Save the updated place document
      await placeDoc.save();
      // Return a success response
      res.json("ok");
    }
  });
});

app.listen(4000);
