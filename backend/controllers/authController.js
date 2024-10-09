import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';

// Register user
export const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({ username, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the user
        await user.save();

        // Generate JWT token for the user
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create JWT token
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, msg: 'Login successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const registerEmployee = async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    const { name, email, mobileNumber, designation, gender, courses } = req.body;
    const image = req.file ? req.file.path : null;

    try {
        const newEmployee = new Employee({
            name,
            email,
            mobileNumber,
            designation,
            gender,
            courses,
            image,
        });

        await newEmployee.save();

        res.status(201).json({ msg: 'Employee registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};