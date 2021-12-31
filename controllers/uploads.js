const express = require("express");
const uploadRouter = express.Router();
const fs = require("fs");
const path = require("path");
const fm = require("formidable");
uploadRouter.use(express.static("public"));


uploadRouter.get("/", async (req, res) => {
	const dirPath = path.join(__dirname, "../public/store");

	const arr = [];
	fs.readdir(dirPath, (err, files) => {
		if (err) { 
			console.log("Unable to scan directory: " + err);
			res.status(400).send({ err });
		}
			files.forEach((file) => {
			arr.push(file);
		});
		res.render("upload", { files: arr, singleFile: null, filename: null });
	});
});

uploadRouter.get("/text", (req, res) => {
	res.render("uploadtext");
});

uploadRouter.get("/picture", (req, res) => {
	res.render("uploadpicture");
});

uploadRouter.post("/text", (req, res) => {
	const { text, filename } = req.body;
	const storeDir = path.join(__dirname, "../public/store");
	fs.writeFile(`${storeDir}/${filename}`, text, (err, data) => {
		console.log(err);
		if (err) return res.status(400).send("oops something went wrong !");
		res.redirect("/uploads");
	});
});

uploadRouter.post("/picture", (req, res) => {
	const form = fm({ multiples: true });
	form.parse(req, (err, fields, files) => {
		console.error("line 45", err);
	
		if (err) return res.status(400).send("oops something went wrong !");
		const oldPath = files.picture.path;
		const storeDir = path.join(__dirname, `../public/store/${fields.filename}`);
		console.log(oldPath, storeDir);

 	let readStream=fs.createReadStream(files.picture.path);
 	let writeStream=fs.createWriteStream(storeDir);
 	readStream.pipe(writeStream);
 	readStream.on('end',function(){
	 fs.unlinkSync(files.picture.path);
	 res.redirect("/uploads");
	});
		
	});

	});

	uploadRouter.get("/:filename", async (req, res) => {
		let singleFile = null; 
		
		const dirPath = path.join(	__dirname, "../public/store/");
	
		const arr = [];
		fs.readdir(dirPath, (err, files) => {
			if (err) {
				console.log("Unable to scan directory: " + err);
				res.status(400).send({ err });
			}
			files.forEach((file) => {
				arr.push(file);
			});
if (req.params.filename) {
	
	const filename = dirPath + req.params.filename;
	
	fs.readFile(filename, (err, data) => {
		if (err) return console.log(err);
		const filetype = filename.split(".");
	
		if (filetype[1] === "jpg" || filetype[1] === "png" || filetype[1] === "jpeg") {
		
			return res.render("upload", { files: arr, filename:  "/store/" + req.params.filename, singleFile: null});
		}
			singleFile = data?.toString("utf8");
		
			return res.render("upload", { files: arr, singleFile, filename: null});
			
	})
	
}
		});
	});

module.exports = uploadRouter;