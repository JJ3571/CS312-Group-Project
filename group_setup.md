# .env setup

Everyone should create a .env file inside the 'Server' folder. This holds the password for your local PostgreSQL instance as well as the session secret. Here are the two lines you should put in the file:

```python
DB_PASSWORD = 'your_pgadmin_password_here'
SESSION_SECRET = 'apAPS*RcU^o2MjonW%9i'
```

The session token is arbirtary, but this ensures we're all using the same instance of it.

# DB Setup

Here are some script templates we can use to ensure we all have the same table records when developing. Edit as needed. 

* Create new Database in PgAdmin labeled CS312_Group_Project
* Execute following script to create tables used in project.
* Uncomment DROP commands to drop and recreate tables with fresh data as needed.
* (Passwords for test users are just their first names. E.g. 'Alice' is the password for Alice. Hashed through bcrypt.)

---

```pgsql
-- Uncomment after initial table creation!
-- DROP TABLE users;

CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255) UNIQUE,
    first_name VARCHAR(255),
    password VARCHAR(255)
);

INSERT INTO users (user_id, first_name, user_email, password) VALUES
('Alice_FTW', 'Alice Jones', 'alice12jones@gmail.com', '$2b$10$jOJcKvoN602Wxjxzs65t2OuQe.Prh7bWU6LL74VrPDV9z8UGFRvOK'),
('Bob_Gnarly', 'Bob Gnarly', 'bobsnotdead@gmail.com', '$2b$10$BjFEXzmLjQZ608WbahLQ2.k7pQbC0ix8TPfUsRYlRWl.F71cpXhaq'),
('Chocolate_Charlie', 'Charlie Bucket', 'charlie4210@gmail.com', '$2b$10$lnFT6VcFXiQmNptQfTpX7edfX6UpZHEXf4BLWUE8oupEJbnU9tVgS');

-- Uncomment after initial table creation!
-- DROP TABLE music;
CREATE TABLE music(
    song_id VARCHAR(255) PRIMARY KEY,
    song_title VARCHAR(255),
    file_link VARCHAR(255),
    artist_id VARCHAR(255),
    artist_name VARCHAR(255),
    album_title VARCHAR(255),
    release_date DATE
);
```

# Client/Server Folders

The easiest way to have frontend/backend separated (atleast from the few videos I watched) was with designated folders. This does mean there are two separate instances you need to start. 

* Open the terminal and navigate to the Client folder. Type 'npm run dev'.
* Open a new terminal window and navigate to the server folder. Type 'npm run dev'.
* You can have them side by side like this:

![1731373157801](image/group_setup/1731373157801.png)

The right side will console log debugging statements from the backend "Server" setup. The left side is the localhost and port where we can view our React app. 

Port 5173 for React. Port 3001 for Express.
