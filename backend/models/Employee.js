import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  mobileNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Mobile number must be 10 digits'],
},
  designation: {
    type: String,
    required: true,
    enum: ['HR', 'Manager', 'Sales'],
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
  },
  courses: {
    type: [String],
    enum: ['MCA', 'BCA', 'BSC'],
  },
  image: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model('newEmployee', employeeSchema);

export default Employee;
