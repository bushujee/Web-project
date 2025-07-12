const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');


app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'mySecretKey123',
  resave: false,
  saveUninitialized: true
}));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// ✅ Dummy users (put here)
const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' }
];

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'landing.html'));
});

// Serve dashboard page (temporary, no auth yet)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});


// Dummy API for chart data
app.get('/api/chart-data', (req, res) => {
  res.json({ labels: ['A', 'B', 'C'], values: [10, 20, 30] });
});



app.get('/api/calendar-events', (req, res) => {
  res.json([
    { title: 'Meeting', start: '2025-07-15' },
    { title: 'Conference', start: '2025-07-20' },
    { title: 'Workshop', start: '2025-07-25' }
  ]);
});

app.get('/api/map-data', (req, res) => {
  res.json({
    lat: 33.6844,
    lng: 73.0479,
    zoom: 12
  });
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    res.send('Username already exists. <a href="/register">Try again</a>');
  } else {
    users.push({ username, password, role: 'user' }); // default role=user
    res.send('Registration successful! <a href="/login">Login now</a>');
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.send('Login failed. <a href="/login">Try again</a>');
  }
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
