// --- Imports ---
import express from "express";
import bodyparser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import dotenv from "dotenv";
import session from "express-session";
import pg from "pg";



// --- .env names ---
// DB_PASSWORD => local Database Password
// SESSION_SECRET => secret for user session storage. (Arbitraty)



// --- Express Setup ---
const app = express();
const port = 3000;
app.set('view engine', 'ejs');


// --- Middlewares (dirname, Body Parser, Morgan, .env) ---
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(morgan("tiny"));
dotenv.config();
const DB_PASSWORD = process.env.DB_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;



// --- Sessions for user auth ---
app.use(session({
    secret: SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));



// --- Database Setup ---
const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'music_app_db',
    password: DB_PASSWORD,
    port: 5432,
});
// db.connect();
// Commented out for now, till DB setup


// --- Page Routes --- (TEMP) 
app.get('/', async (req, res) => {
    res.render('index');
});



// --- Server Start ---
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});