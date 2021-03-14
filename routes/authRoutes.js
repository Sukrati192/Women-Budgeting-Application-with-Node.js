const express = require("express");
const { login, register } = require("../controllers/authControllers");
const { check } = require("express-validator");

const router = express.Router();

router.post("/login", login);
router.post(
	"/register",
	[
		check("firstname")
			.trim()
			.not()
			.isEmpty()
			.withMessage("Firstname is required"),
		check("email").trim().isEmail().withMessage("Invalid e-mail"),
		check("password")
			.trim()
			.isLength({ min: 8 })
			.withMessage("Password too short. Minimum size 8"),
		check("cpassword")
			.trim()
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error("Password does not match password");
				}
				return true;
			}),
	],
	register
);

module.exports = router;