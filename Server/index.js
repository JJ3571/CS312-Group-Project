// --- Imports ---
import bodyparser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import bcrypt from "bcrypt";


// --- Express Setup ---
const app = express();
const port = 3001;
const saltRounds = 10;



// --- Middlewares ---
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(morgan("tiny"));
dotenv.config();
const DB_PASSWORD = process.env.DB_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(cors({
  origin: 'http://localhost:5173', // should update to const for Vite port
  credentials: true,
}));

const isAuthenticated = (req, res, next) => { // auth check
  console.log('Session:', req.session);
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

// --- Database Setup ---
const { Pool } = pg;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CS312_Group_Project',
  password: DB_PASSWORD,
  port: 5432,
});
pool.connect().then(() => {
  console.log("Connected to PostgreSQL database."); // debug testing
}).catch((err) => {
  console.error("Failed to connect to PostgreSQL:", err);
});

// --- Routes ---

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error logging out.' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logged out successfully.' });
  });
});

// Sign up
app.post("/api/signup", async (req, res) => {
  const { user_id, user_email, first_name, password } = req.body;
  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE user_id = $1", // update to email rather than username. Have return check for both username/email uniqueness and redirect to sign in page
      [user_id]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email already taken. Please choose another." });
    }
    const hash = await bcrypt.hash(password, saltRounds);
    await pool.query(
      "INSERT INTO users (user_id, , user_email, first_name, password) VALUES ($1, $2, $3, $4)",
      [user_id, user_email, first_name, hash]
    );
    res.status(201).json({ message: "Signup successful. Please sign in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Sign in
app.post("/api/signin", async (req, res) => {
  const { user_id, password } = req.body;
  console.log("Signin attempt:", { user_id }); // debug testing
  
  if (!user_id || !password) {
    return res.status(400).json({ success: false, message: "User ID and password are required." });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid user ID or password." });
    }
    
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      req.session.userId = user.user_id;
      req.session.name = user.first_name.split(' ')[0];
      req.session.email = user.user_email;
      //req.session.preferences = user.preferences; // add preferences to session. Maybe store these preferences in a separate table with user_id as foreign key?
      console.log("Session set:", req.session); // debug testing
  
      res.json({ success: true, user: { user_id: user.user_id, name: user.name } });
    } else {
      return res.status(400).json({ success: false, message: "Invalid user ID or password." });
    }

  } catch (err) {
    console.error("Error during signin:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// Fetch current user
app.get('/api/currentUser', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ success: true, user: { user_id: req.session.userId, name: req.session.name } });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
  }
});

// Routes for fetching music data and returning it to client based on potential filters or user preferences
app.get('/api/music', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM music");
    res.json({ success: true, songs: result.rows });
  } catch (err) {
    console.error('Error fetching music:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Create new playlist
app.post('/api/playlists', isAuthenticated, async (req, res) => {
  const { playlistName } = req.body;
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      "INSERT INTO playlists (user_id, playlist_name) VALUES ($1, $2) RETURNING *",
      [userId, playlistName]
    );
    res.json({ success: true, playlist: result.rows[0] });
  } catch (err) {
    console.error('Error creating playlist:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Add a song to playlist
app.post('/api/playlists/:playlistId/songs', isAuthenticated, async (req, res) => {
  const { playlistId } = req.params;
  const { songId } = req.body;

  try {
    // Fetch current highest song order for user's playlist
    const maxOrderResult = await pool.query(
      "SELECT COALESCE(MAX(song_order), 0) AS max_song_order FROM playlist_songs WHERE playlist_id = $1",
      [playlistId]
    );
    const maxSongOrder = maxOrderResult.rows[0].max_song_order;

    // Insert the new song with song_order set to max_song_order + 1
    const result = await pool.query(
      "INSERT INTO playlist_songs (playlist_id, song_id, song_order) VALUES ($1, $2, $3) RETURNING *",
      [playlistId, songId, maxSongOrder + 1]
    );
    res.json({ success: true, playlistSong: result.rows[0] });
  } catch (err) {
    console.error('Error adding song to playlist:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Start server
app.listen(port, () => {
  console.log("Server is running on port:", port);
});
