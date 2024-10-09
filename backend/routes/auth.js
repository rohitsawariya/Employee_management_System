import express from 'express'; 
import { loginUser, registerEmployee } from '../controllers/authController.js';
import bcrypt from 'bcryptjs'; 
import User from '../models/User.js';
import multer from 'multer'; 
import Employee from '../models/Employee.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const upload = multer({ storage: storage });

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route POST /api/auth/login
// @desc  Login user and return token
// @access Public
router.post('/login', loginUser);

// @route POST /api/auth/employee/register
// @desc  Register a new employee
// @access Public
router.post('/employee/register', upload.single('image'), registerEmployee); 
router.get('/employees', async (req, res) => {
    try {
      const employees = await Employee.find(); // Fetch all employee data
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching employee data' });
    }
  });
  router.delete('/employees/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Employee.findByIdAndDelete(id);
  
      if (!result) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.put('/employees/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, email, mobileNumber, designation, gender, courses } = req.body;
    const image = req.file ? req.file.path : null; // Get image path from multer

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.name = name;
        employee.email = email;
        employee.mobileNumber = mobileNumber;
        employee.designation = designation;
        employee.gender = gender;
        employee.courses = courses; // Update courses
        if (image) {
            employee.image = image; 
        }

        await employee.save();
        res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error });
    }
});




export default router;
