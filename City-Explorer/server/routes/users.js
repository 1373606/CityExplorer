import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { authenticateUser, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// In-memory user database for demo (imported from auth.js)
// For demo, we'll redefine it here
const users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LG1.7EZf/PDFJYQRbxJx/Mwfj74tEYW', // "password123"
    role: 'admin',
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LG1.7EZf/PDFJYQRbxJx/Mwfj74tEYW', // "password123"
    role: 'user',
    createdAt: new Date(),
    lastLogin: new Date()
  }
];

// Get all users (Admin only)
router.get('/', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    // Return users without passwords
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(usersWithoutPasswords);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID (Admin only or current user)
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    // Check if user is admin or requesting their own data
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to access this user data' });
    }
    
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Create a new user (Admin only)
router.post('/', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      createdAt: new Date(),
      lastLogin: null
    };
    
    // Save user
    users.push(newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Update a user (Admin only or current user)
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    // Check if user is admin or updating their own data
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }
    
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent non-admin users from changing their role
    if (req.user.role !== 'admin' && req.body.role) {
      return res.status(403).json({ message: 'Not authorized to change role' });
    }
    
    // Update user with provided fields
    const updatedUser = { ...users[userIndex] };
    
    if (req.body.name) updatedUser.name = req.body.name;
    if (req.body.email) updatedUser.email = req.body.email;
    if (req.body.role && req.user.role === 'admin') updatedUser.role = req.body.role;
    
    // Update password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updatedUser.password = await bcrypt.hash(req.body.password, salt);
    }
    
    users[userIndex] = updatedUser;
    
    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete a user (Admin only)
router.delete('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting the last admin user
    if (users[userIndex].role === 'admin' && users.filter(u => u.role === 'admin').length <= 1) {
      return res.status(400).json({ message: 'Cannot delete the last admin user' });
    }
    
    // Remove user
    users.splice(userIndex, 1);
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;