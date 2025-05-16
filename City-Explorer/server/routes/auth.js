import express from 'express';
import supabase from '../supabaseClient.js'; // Adjust path as needed

const router = express.Router();


router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log('Received signup request:', { email, password, name });

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
       email_confirm: true,
      options: {
        data: { name },
      },
    });

    if (error) {
      console.error('Supabase signup error:', error); // Log the full error object
      return res.status(400).json({ message: 'Sign-up failed', error: error.message });
    }

    console.log('Signup successful:', data);
    res.status(201).json({
      message: 'Sign-up successful. Please check your email to confirm your account (if confirmation is enabled).',
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error('Error during sign-up:', err);
    res.status(500).json({ message: 'Internal server error during sign-up' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: password ? 'provided' : 'missing' });

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase login error:', error); // 🔍 log error details
      return res.status(401).json({ message: 'Login failed', error: error.message });
    }

    console.log('Login successful:', data.user?.email);
    res.status(200).json({
      message: 'Login successful',
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});


// Logout route
router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ message: 'Logout failed', error: error.message });
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Error during logout:', err);
    res.status(500).json({ message: 'Internal server error during logout' });
  }
});

export default router;