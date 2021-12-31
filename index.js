const express = require("express");
const app = express();
const port = 3001;
const uploadRouter = require("./controllers/uploads");
const bodyParser = require("body-parser");
const restaurantRouter = require("./controllers/restaurant");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
	res.render("chat");
});
// app.get("/", (req, res) => {
// 	res.render("upload", { files: [], singleFile: "singleFile" });
// });

app.use("/uploads", uploadRouter);
// app.use("/api/restaurant", restaurantRouter);

const connection = app.listen(port, () => {
	console.log("server is listening on port", port);
});

const io = require("socket.io")(connection);
io.on("connection", (socket) => {
	console.log("new user connected");
	socket.on("newMsg", (data) => {
		console.log(data);
	});
	socket.emit("messageReceived", { status: "ok" });
});
