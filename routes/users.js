const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, authChecker, updateUser, getUser, uplaodProfile } = require("../controllers/AuthController");
const authGuard = require("../middlewares/authguard");

// Registers a new User
router.post("/register", registerUser );

// Logs In a User, creates session in mongo store
// and returns a cookie containing sessionID, also called "session-id"
router.post("/login", loginUser);

// Log out user by deleting session from store
// and deleting cookie on client side
// Needs cookie containing sessionID to be attached to request
router.delete("/logout", logoutUser);

// Check if user is Authenticated by reading session data
// Needs cookie containing sessionID
router.get("/authchecker", authGuard, authChecker);

router.post("/update/:id", authGuard, updateUser);
router.get("/getUser/:id", authGuard, getUser);

router.post("/uploadProfile", uplaodProfile);
module.exports = { router };