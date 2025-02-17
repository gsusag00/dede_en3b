const express = require('express');
const cors = require('cors');
const bp = require('body-parser');
const promBundle = require("express-prom-bundle");
import api from "./routers/api";
import solid from "./routers/solid";
//import ensurer from "./routers/solidEnsurer";
import { SolidConnection } from "./SOLID/API";
const mongoose =  require('mongoose');
import { Application } from "express";
require('dotenv').config();

//mongodb+srv://username:password@pruebaasw.dxqcq.mongodb.net/exampleDatabase?retryWrites=true&w=majority
const port: number = (process.env.PORT!==undefined? +process.env.PORT : 5000) || 5000;

declare module 'express-session' {
	interface SessionData {
		connection?: SolidConnection;
	}
}

async function connect() {
	const app = express();
	

	const options = {
		origin: "*"
	};

	console.log("Application started: " + port);

	const metricsMiddleware = promBundle({
		includeMethod: true,
	});
	app.use(metricsMiddleware);
	app.use(cors(options));
	app.use(bp.json());

	await restapi(app);
	await solidapi(app);

	app
		.listen(port, (): void => {
			console.log("Restapi listening on " + port);
		})
		.on("error", (error: Error) => {
			console.error("Error occured: " + error.message);
		});
}

function restapi(app: Application) {
	// const mongoUrl = "mongodb://localhost:27017/exampleDatabase";
	//This is the url of the connection to the database, currently the database is stored in MongoDB Atlas (A browser version for MongoDB)
	//The user and the password are for this instance only and will be changed for when this is merged.
	var mongoUrl = process.env.DEDE || process.env.DEDE_HEROKU;
	//Creation of the connection for the database. Pretty simple like any other db.
	mongoose
		.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
		.then(() => {

			app.use("/api", api);
		});

	const db = mongoose.connection;
	db.on("error",console.error.bind(db,"Error on connection: "));
};

function solidapi(app: Application) {
//	app.use("/solid/", ensurer);
	app.use("/solid", solid);
}

//Timeout to allow the database to finish building.
setTimeout(connect,1000);
