const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

const privateKey = process.env.SECERETKEY;

// const getUserDetails = async (req, res, next) => {
// 	res.status(200).json(req.user);
// };

const updateUserProfile = async (req, res, next) => {
	const { user } = req;
	console.log(req.body);
	if (user) {
		user.firstname = req.body.firstname || user.firstname;
		user.lastname = req.body.lastname || user.lastname;
		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();
		if (updatedUser) {
			res.status(200).json({
				name: updatedUser.fullname,
				profile: user.profile,
				token: jwt.sign({ token: updatedUser._id }, privateKey, {
					algorithm: "HS256",
				}),
			});
		} else {
			res.status(400).json({
				error: "Something went wrong. Error in updation",
			});
		}
	} else {
		res.status(404).json({
			error: "User not found",
		});
	}
};

const getUserById = async (req, res, next) => {
	const user = await User.findById(req.params._id).populate("notes");
	if (user) {
		res.status(200).json(user);
	} else {
		res.status(204).json({
			error: "No such User",
		});
	}
};

const updateUser = async (req, res, next) => {
	const user = await User.findById(req.params._id).populate("notes");

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();
		if (updatedUser) {
			res.status(200).json({
				name: updatedUser.fullname,
				profile: user.profile,
				notes: user.notes,
				email: updatedUser.email,
				isAdmin: updatedUser.isAdmin,
				token: jwt.sign({ token: updatedUser._id }, privateKey, {
					algorithm: "HS256",
				}),
			});
		} else {
			res.status(400).json({
				error: "Something went wrong. Error in updation",
			});
		}
	} else {
		res.status(404).json({
			error: "User not found",
		});
	}
};

const deleteUser = async (req, res, next) => {
	const user = await User.findByIdAndDelete({ _id: req.params.id });
	if (user) {
		res.status(200).json({
			message: "User deleted succesfully",
		});
	} else {
		res.status(205).json({
			error: "Error in deletion",
		});
	}
};

const getAllUsers = async (req, res, next) => {
	const users = await User.find({}).select("-password -_id ");
	if (users) {
		res.status(200).json(users);
	} else {
		res.status(404).json({
			error: "No users registered",
		});
	}
};

module.exports = {
	// getUserDetails,
	updateUserProfile,
	getUserById,
	updateUser,
	deleteUser,
	getAllUsers,
};