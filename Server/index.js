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
app.use('/music', express.static(__dirname + '/Server/NCS_Music')); // Added to serve music files!
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
  const { user_username, user_email, first_name, password } = req.body;
  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE user_email = $1", // update to email rather than username. Have return check for both username/email uniqueness and redirect to sign in page
      [user_email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email already taken. Please choose another." });
    }
    const hash = await bcrypt.hash(password, saltRounds);
    await pool.query(
      "INSERT INTO users (user_username, , user_email, first_name, password) VALUES ($1, $2, $3, $4)",
      [user_username, user_email, first_name, hash]
    );
    res.status(201).json({ message: "Signup successful. Please sign in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Sign in
app.post("/api/signin", async (req, res) => {
  const { user_username, password } = req.body;
  console.log("Signin attempt:", { user_username }); // debug testing
  
  if (!user_username || !password) {
    return res.status(400).json({ success: false, message: "User ID and password are required." });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE user_username = $1", [user_username]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid user ID or password." });
    }
    
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      req.session.userId = user.user_id;
      req.session.username = user.user_username;
      req.session.name = user.full_name.split(' ')[0];
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
    const result = await pool.query("SELECT * FROM songs");
    res.json({ success: true, songs: result.rows });
  } catch (err) {
    console.error('Error fetching music:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Fetch songs by genre 
app.get('/api/genre', isAuthenticated, async (req, res) => {
  const { genre } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM songs WHERE genre ILIKE $1",
      [`%${genre}%`]
    );
    res.json({ success: true, songs: result.rows });
  } catch (err) {
    console.error('Error fetching songs by genre:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Fetch songs by mood
app.get('/api/mood', isAuthenticated, async (req, res) => {
  const { mood } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM songs WHERE mood ILIKE $1",
      [`%${mood}%`]
    );
    res.json({ success: true, songs: result.rows });
  } catch (err) {
    console.error('Error fetching songs by mood:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Fetch the user's listening history
app.get('/api/history', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM songs WHERE song_id IN (SELECT song_id FROM user_history WHERE user_id = $1)",
      [req.session.userId]
    );
    res.json({ success: true, history: result.rows });
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});


// Fetch playlists for the current user
app.get('/api/playlists', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM playlists WHERE user_id = $1", [req.session.userId]);
    res.json({ success: true, playlists: result.rows });
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// function to create a playlist 
//define a post request for the route to playlists within the api
app.post('/api/playlists', isAuthenticated, async (req,res) => 
{
  // define a constant playlist name and set it equal to data sent from client
  const { playlistName } = req.body;

  // try to create the playlist within the database 
  try
  {
  //insert a new playlist into the "playlists" table
    const result = await pool.query
  (
    "INSERT INTO playlists (playlist_name) VALUES ($1) RETURNING *",
    [playlistName]
  );
  res.json({success: true, playlist: result.rows[0]});
  }
  //if an error occurs display an error message 
  catch(err)
  {
    console.error('Error creating the playlist:', err);
    res.status(500).json({success: false, message: 'Server error.'});
  }
});
  
  
// function to add a song to a playlist. 
app.post('/api/playlists/:playlistId/songs', isAuthenticated, async (req, res) => 
{
  //access playlistId and songId from client
  const { playlistId } = req.params;
  const { songId } = req.body;
  
  try 
  {
    // add song to playlist_songs table
    const result = await pool.query
    (
      "INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2) RETURNING *",
      [playlistId, songId]
    );
    // return success if task completed successfully 
    res.json({ success: true, songAdded: result.rows[0] });
  } 
  // if not, send an error code
  catch (err) 
  {
    console.error('Error adding song to playlist:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});
  
  
//  function to delete a song from a playlist
app.delete('/api/playlists/:playlistId/songs/:songId', isAuthenticated, async (req, res) => 
{
  // access playlistId and songId from client
  const { playlistId, songId } = req.params;
  
  try 
  {
    // Remove song from playlist
      // delete the song from the playlists_songs table
    const result = await pool.query
    (
      "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING *",
      [playlistId, songId]
    );

    // if a row is not affected the song is not in the playlist and return an error code:
    if (result.rows.length === 0) 
    {
      return res.status(404).json({ success: false, message: 'Song not found in this playlist.' });
    }

    // if the song is removed successfully, express so. 
    res.json({ success: true, songRemoved: result.rows[0] });
  } 
  catch (err) 
  {
    // if an error occurs, express so. 
    console.error('Error removing song from playlist:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});
  
// function to search for a specific song
app.get('/api/songs/search', async (req, res) => 
{   
  const { query } = req.query;  
  try {
      const result = await pool.query(
          "SELECT * FROM songs WHERE song_title ILIKE $1 OR artist_name ILIKE $1",
          [`%${query}%`]
      );
      
      res.json({ success: true, songs: result.rows });
  } catch (err) {
      console.error('Error searching for songs:', err);
      res.status(500).json({ success: false, message: 'Server error.' });
  }
});
  
  
app.post('/api/songs/:songId/feedback', async (req, res) => 
  {
      const { songId } = req.params;
      const { feedback, user_id } = req.body; 


      try 
      {
          const result = await pool.query
          (
              "INSERT INTO song_feedback (song_id, feedback, user_id) VALUES ($1, $2, $3) RETURNING *", 
          [songId, feedback, userID]
          );

          res.json({ success: true, feedbackGiven: result.rows[0] });
      } 
      catch (err) 
      {
          console.error('Error submitting feedback:', err);
          res.status(500).json({ success: false, message: 'Server error.' });
      }
  });

// Start server
app.listen(port, () => {
  console.log("Server is running on port:", port);
});
