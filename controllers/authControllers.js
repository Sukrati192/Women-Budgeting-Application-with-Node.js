const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const privateKey = process.env.SECERETKEY;

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user && (await user.authenticate(password))) {
		const token = jwt.sign({ token: user._id }, privateKey, {
			algorithm: "HS256",
		});
		res.status(200).json({
			id: user._id,
			name: user.fullname,
			email: user.email,
			profile: user.profile,
			isAdmin: user.isAdmin,
			token,
		});
	} else {
		res.status(400).json({
			error: "Invalid Email or Password",
		});
	}
};

const register = async (req, res) => {
	let errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors = errors.array();
		const nameError = errors.find((obj) => obj.param === "firstname") || "";
		const emailError = errors.find((obj) => obj.param === "email") || "";
		const passwordError = errors.find((obj) => obj.param === "password") || "";
		const cpasswordError =
			errors.find((obj) => obj.param === "cpassword") || "";

		const error = {
			name: nameError.msg,
			email: emailError.msg,
			password: passwordError.msg,
			cpassword: cpasswordError.msg,
		};

		res.status(400).json({ error });
	} else {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			const { firstname, lastname, password } = req.body;
			let newUser = new User({ firstname, lastname, email, password });
			newUser.save();
			const token = jwt.sign({ token: newUser._id }, privateKey, {
				algorithm: "HS256",
			});
			res.status(201).json({
				id: newUser._id,
				name: newUser.fullname,
				email: newUser.email,
				profile: newUser.profile,
				isAdmin: newUser.isAdmin,
				token,
			});
		} else {
			res.status(409).json({
				error: { error: "User already exists" },
			});
		}
	}
};

const protect = asyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, privateKey);
			req.user = await User.findById(decoded.token)
				.populate("notes")
				.select("-password");
			next();
		} catch (error) {
			res.status(401).json({
				error: "Not authorized, token failed",
			});
		}
	}

	if (!token) {
		res.status(401).json({
			error: "Not authorized, no token",
		});
	}
});

const admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.status(401).json({
			error: "Not authorized as an admin",
		});
	}
};

module.exports = { login, register, protect, admin };