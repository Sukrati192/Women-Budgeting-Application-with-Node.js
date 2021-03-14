const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
	title: {
		type: String,
	},
	content: {
		type: String,
	},

	dateUpdated: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Note", noteSchema);