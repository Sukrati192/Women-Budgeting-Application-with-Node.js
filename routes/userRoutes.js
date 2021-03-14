const express = require("express");
const router = express.Router();
const {
	// getUserDetails,
	updateUserProfile,
	getUserById,
	updateUser,
	deleteUser,
	getAllUsers,
} = require("../controllers/userControllers");
const { protect, admin } = require("../controllers/authControllers");

router
	.route("/profile")
	// .get(protect, getUserDetails)
	.put(protect, updateUserProfile);

router.get("/", protect, admin, getAllUsers);
router
	.route("/:id")
	.get(protect, admin, getUserById)
	.put(protect, admin, updateUser)
	.delete(protect, admin, deleteUser);

module.exports = router;