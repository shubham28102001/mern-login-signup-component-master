const bcrypt = require("bcryptjs");
const User = require("../models/User"); // User model
const Joi = require("@hapi/joi");
const { registerSchema, loginSchema } = require("../utils/userValidations");
const UserService = require("../services/userService");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const SECRETS = require("../common/secrets");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({region: "us-east-1"});

exports.isAuth = (req, res, next) => {
  const sessUser = req.session.user;
  if (sessUser) {
    next();
  } else {
    err = res
      .status(401)
      .json("You Need to Be Logged in to do this. Access Denied ");
    return err;
  }
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const result = registerSchema.validate({ name, email, password });
  if (!result.error) {
    try {
      const requestBody = {
        id: uuidv4(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };
      const user = await UserService.register(requestBody);
      if (!user) {
        return res.json("Error occured in Login");
      }
      res.json(user);
    } catch (error) {
      console.error(error);
    }
  } else {
    res.status(422).json(result.error.details[0].message);
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // basic validation
  const result = loginSchema.validate({ email, password });
  if (!result.error) {
    try {
      const user = await UserService.login(req.body.email);
      if (!user) {
        const responseMessage = {
          message: "User Not Found.",
          status: 400,
          error: "User Not Found.",
        };
        return res.status(401).send(responseMessage);
      }
      if (user.password != password) {
        const responseMessage = {
          message: "Incorrect Username & Password.",
          status: 401,
          error: "Incorrect Username & Password.",
        };
        return res.status(401).send(responseMessage);
      }
      const payload = {
        name: user.name,
        email: user.email,
        password: user.password,
        id: user.id,
        profile: user.profile,
        key: user.key
      };

      const secretValue = await SECRETS.getSecrets();

      const token = jwt.sign(payload, secretValue.jwtsecret, {});
      const responseMessage = {
        message: "Logged in successfully!",
        token: token,
        expiresIn: "1h",
        isSuccess: true,
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        profile: user.profile,
        key: user.key
      };
      res.json(responseMessage);
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log(result.error);
    res.status(422).json(result.error.details[0].message);
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    // delete session data from store, using sessionID in cookie
    if (err) throw err;
    res.clearCookie("session-id"); // clears cookie containing expired sessionID
    res.send("Logged out successfully");
  });
};

exports.authChecker = (req, res) => {
  const sessUser = req.user;
  if (sessUser) {
    return res.json(sessUser);
  } else {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserService.updateUser(id, req.body);
    if (!user) {
      res.json({ message: "User Not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await UserService.getUser(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error);
  }
};

exports.uplaodProfile = async (req,res) => {
  try {
    const buffer = Buffer.from(req.body.image.replace(/^data:image\/\w+;base64,/, ""),'base64')
    const params = {
      Bucket: "mern-login-signup",
      Key: req.body.imageName,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: "image/jpeg",
    };

    const response = await s3.upload(params).promise();
    const profile = response.Location;
    const responseMessage = {
      url: profile,
      key: req.body.imageName
    }
   res.status(200).send(responseMessage)
  } catch (error) {
    console.error(error)
  }
}