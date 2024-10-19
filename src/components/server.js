const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const firebaseAdmin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./key.json'); // Replace with your Firebase service account key
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://fir-apk-e5d86-default-rtdb.firebaseio.com/"  // Replace with your Firebase Realtime Database URL
});

const app = express();
const db = firebaseAdmin.database(); // Access Firebase Realtime Database
const auth = firebaseAdmin.auth(); // Firebase Authentication
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Register user using Firebase Auth
app.post('/api/register', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Firebase creates the user and authenticates
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store user details in Realtime Database
    const userRef = db.ref('users').child(userRecord.uid);
    await userRef.set({
      email,
      role,
      password: hashedPassword, // Storing hashed password
    });
    console.alert("registered succesfully");
    res.status(200).send('User registered successfully');
  } catch (error) {
    res.status(400).send('Error in registration: ' + error.message);
  }
});

// Login using Firebase Auth and compare hashed passwords
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user from Firebase Auth
    const userRecord = await auth.getUserByEmail(email);

    // Fetch user details from Realtime Database
    const userRef = db.ref('users').child(userRecord.uid);
    const userSnapshot = await userRef.once('value');

    if (!userSnapshot.exists()) {
      return res.status(400).send('User not found');
    }

    const user = userSnapshot.val();

    // Compare the password with the stored hashed password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).send('Invalid password');
    }

    // Successful login
    res.status(200).send({ message: 'Login successful', user });
  } catch (error) {
    res.status(400).send('Error logging in: ' + error.message);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
