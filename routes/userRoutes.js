const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const rbac = require("../middlewares/rbacMiddleware");

const router = express.Router();


router.get("/admin", verifyToken, rbac(["Admin"]), (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

router.get("/user", verifyToken, rbac(["User", "Admin"]), (req, res) => {
  res.status(200).json({ message: "Welcome, User!" });
});

router.get("/moderator", verifyToken, rbac(["Moderator", "Admin"]), (req, res) => {
  res.status(200).json({ message: "Welcome, Moderator!" });
});

module.exports = router;
