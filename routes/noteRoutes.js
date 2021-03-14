const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const { protect } = require("../controllers/authControllers");
const {
	addNote,
	updateNote,
	deleteNote,
	getAllNotes,
} = require("../controllers/noteControllers");

router.route("/").post(protect, addNote).get(protect, getAllNotes);
router.route("/:noteId").put(protect, updateNote).delete(protect, deleteNote);

module.exports = router;