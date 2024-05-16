// Load environment variables from .env file
import App from "./app/App";
import Database from "./app/database/Database";
// Initialize axios interceptors
import './app/helpers/axios'
import SenseIV from "./app/socket/SenseIV";

require('dotenv').config()

// create database connection
const connection = Database.getConnection()

// start fastify http server
const app = new App()
app.start()

const senseIV = new SenseIV(app)
senseIV.start()