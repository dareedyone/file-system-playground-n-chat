require("dotenv").config();
const express = require("express");
const restaurantRouter = express.Router();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const uri = process.env.MONGODB_URI;

mongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
	if (err) throw err;
	console.log("CONNECTED TO DATABASE");
	const db = client.db("restaurant");
	// console.log(db.collection("customers"));
	if (db.collection("customers") && db.collection("customers"))
		return console.log("collections already created");
	db.createCollection("customers", (err, res) => {
		if (err) throw err;
		console.log(res);
	});
	db.createCollection("foods", (err, res) => {
		if (err) throw err;
		console.log(res);
	});
});

restaurantRouter.post("/customers", (req, res) => {
	// const { name, address, email, phonenumber } = req.body;
	mongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
		if (err) throw err;
		console.log("CONNECTED TO DATABASE");
		const customerCollection = client.db("restaurant").collection("customers");
		customerCollection.insertOne({ ...req.body, instance: 0 }, (err, data) => {
			if (err) return console.log(err);
			res.send("customers saved!");
		});
	});
});

restaurantRouter.put("/customers", (req, res) => {
	const { email } = req.body;
	mongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
		if (err) throw err;
		console.log("CONNECTED TO DATABASE");
		const customerCollection = client.db("restaurant").collection("customers");
		customerCollection.updateOne(
			{ email },
			{ $set: { ...req.body }, $inc: { instance: 1 } },
			(err, data) => {
				if (err) return console.log(err);
				res.send("customers updated!");
			}
		);
	});
});

restaurantRouter.delete("/customers", (req, res) => {
	const { email } = req.body;
	mongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
		if (err) throw err;
		console.log("CONNECTED TO DATABASE");
		const customerCollection = client.db("restaurant").collection("customers");
		customerCollection.deleteOne({ email }, (err, data) => {
			if (err) return console.log(err);
			res.send("customers deleted!");
		});
	});
});

restaurantRouter.post("/foods", (req, res) => {
	const { name } = req.body;
	mongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
		if (err) throw err;
		console.log("CONNECTED TO DATABASE");
		const customerCollection = client.db("restaurant").collection("foods");
		customerCollection.insertOne({ name, date: new Date() }, (err, data) => {
			if (err) return console.log(err);
			res.send("customers saved!");
		});
	});
});
module.exports = restaurantRouter;
