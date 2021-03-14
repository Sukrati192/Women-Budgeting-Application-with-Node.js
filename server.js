const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");

mongoose.connect(process.env.DBURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

app.use(express.json());
const PORT = 5000 || process.env.PORT;

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/user/:id/note", noteRoutes);

app.listen(PORT, () => {
	console.log(`Server up and running on port ${PORT}`);
});