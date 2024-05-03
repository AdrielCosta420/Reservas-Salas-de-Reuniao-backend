const express = require('express');


const { register, login, checkUser, getUserById } = require('../controllers/UserController');
const verifyToken = require("../helpers/check_token");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check-user", checkUser);
router.get("/user/:id", verifyToken, getUserById);


module.exports = router;