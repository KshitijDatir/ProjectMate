const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
//const authMiddleware = require("../middlewares/authMiddleware");

// public routes
router.post("/register", register);
router.post("/login", login);

// // 🔐 protected test route         // TO CHECK THE AUTH ROUTE FOR LOGIN IS WORKING OR NOT
// router.get("/me", authMiddleware, (req, res) => {
//   res.json({
//     message: "Access granted",
//     user: req.user,
//   });
// });

module.exports = router;
