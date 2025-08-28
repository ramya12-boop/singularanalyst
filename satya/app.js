const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// ✅ Serve static files from the public folder
app.use(express.static('public'));

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: true
}));

// ✅ In-memory user store
let users = {};

// ✅ Home Page
app.get('/', (req, res) => {
  if (req.session.username) {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
  } else {
    res.redirect('/login');
  }
});

// ✅ Login Page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    req.session.username = username;
    res.redirect('/');
  } else {
    res.send('Invalid credentials. <a href="/login">Try again</a>');
  }
});

// ✅ Register Page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    res.send('User already exists. <a href="/register">Try again</a>');
  } else {
    users[username] = password;
    res.redirect('/login');
  }
});

// ✅ Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});
app.get('/user', (req, res) => {
  if (req.session.username) {
    res.json({ username: req.session.username });
  } else {
    res.json({ username: null });
  }
});
// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
