const User = require("../models/User");
const Note = require("../models/Note");

const addNote = async (req, res, next) => {
	const note = new Note(req.body);
	const user = await User.findById(req.user._id);
	user.notes.push(note);
	if ((await user.save()) && (await note.save())) {
		res.status(201).json({
			message: "Note added",
			note,
		});
	} else {
		res.status(400).json({
			error: "Note not added",
		});
	}
};

const deleteNote = async (req, res, next) => {
	const note = await Note.findById(req.params.noteId);
	const user = await User.findById(req.user._id);
	if (note) {
		await note.remove();
		user.notes.pull({ _id: req.params.noteId });
		await user.save();
		res.status(200).json({
			message: "Note deleted succesfully",
		});
	} else {
		res.status(205).json({
			error: "Error in deletion",
		});
	}
};

const updateNote = async (req, res, next) => {
	const note = await Note.findById(req.params.noteId);
	if (note) {
		note.title = req.body.title;
		note.content = req.body.content;
		note.dateUpdated = new Date();
		const updatedNote = await note.save();

		if (updatedNote) {
			res.status(200).json({
				message: "Successfully updated",
				note: updatedNote,
			});
		} else {
			res.status(400).json({
				error: "Note updation failed",
			});
		}
	} else {
		res.status(404).json({
			error: "Note not found",
		});
	}
};

const getAllNotes = async (req, res, next) => {
	res.status(200).json({
		notes: req.user.notes,
	});
};

module.exports = { addNote, updateNote, deleteNote, getAllNotes };