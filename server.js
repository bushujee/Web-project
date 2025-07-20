const express = require('express');
const app = express();
const path = require('path');
const db=require('./db');

const User=require('./models/user');
const session = require('express-session');
const bodyParser=require('body-parser')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Session middleware
app.use(session({
  secret: 'mySecretKey123',
  resave: false,
  saveUninitialized: true
}));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));




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


//apiendpoint
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({
      _id: req.session.user._id,
      username: req.session.user.username,
      email:req.session.user.email,
      contact:req.session.user.contact,
      fee:req.session.user.fee,
      role: req.session.user.role
    });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

//logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
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

//post
app.post('/register', async (req, res) => {
  const { username, password ,email,contact} = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.send('Username already exists. <a href="/login">Login here</a>');
    }

    // Create and save new user
    const newUser = new User({ username, password, email, contact,fee: 'paid', role: 'user' });
    await newUser.save();

    res.send('Registration successful! <a href="/login">Login now</a>');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error. <a href="/register">Try again</a>');
  }
});


app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      req.session.user = user;
      res.redirect('/dashboard');
    } else {
      res.send('Login failed. <a href="/login">Try again</a>');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


//edit button
app.put("/edit/:id", async(req, res)=>{
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "No ID provided" });
    }

    const updates = req.body;
    const updateuser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updateuser) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(updateuser);
      console.log("updated");
    }
  } catch (er) {
    
  }
});


//deleteendpoint
app.delete("/delete/:id", async(req,res)=>{
  try{

    const id=req.params.id;
    res.json(id)
    await User.findByIdAndDelete(id);
    console.log("delete record");
    }
    catch(er){
      console.error(er);
      res.status(500).send('Internal server error');
    }

  

})





// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
