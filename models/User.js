const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Note = require("./Note");

const userSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: true,
		},

		lastname: {
			type: String,
			default: " ",
		},

		email: {
			type: String,
			required: true,
			unique: true,
		},

		password: {
			type: String,
			required: true,
		},

		profile: {
			data: Buffer,
			contentType: String,
		},

		isAdmin: {
			type: Boolean,
			default: false,
		},

		notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
	},
	{ timeStamp: true }
);

userSchema.virtual("fullname").get(function () {
	return this.firstname + " " + this.lastname;
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.authenticate = async function (plainpassword) {
	const isMatched = await bcrypt.compare(plainpassword, this.password);
	return isMatched;
};

module.exports = mongoose.model("User", userSchema);