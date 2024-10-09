import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+$/, 'Username cannot contain spaces'], 
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('employee', userSchema);

export default User;
