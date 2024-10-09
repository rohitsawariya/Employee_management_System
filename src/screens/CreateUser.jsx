import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CreateUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const { employee } = location.state || {}; // Get employee data from location state

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        designation: '',
        gender: '',
        courses: {
            MCA: false,
            BCA: false,
            BSC: false,
        },
        image: null,
    });

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name,
                email: employee.email,
                mobileNumber: employee.mobileNumber,
                designation: employee.designation,
                gender: employee.gender,
                courses: {
                    MCA: employee.courses.includes('MCA'),
                    BCA: employee.courses.includes('BCA'),
                    BSC: employee.courses.includes('BSC'),
                },
                image: null, // Set this if you want to handle image uploads
            });
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prev) => ({
                ...prev,
                courses: {
                    ...prev.courses,
                    [name]: checked,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
    //         setFormData((prev) => ({
    //             ...prev,
    //             image: file,
    //         }));
    //     } else {
    //         alert('Please upload a valid image (jpg or png)');
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!validateEmail(formData.email)) {
            alert('Invalid email format.');
            return;
        }
        
        if (!validateMobileNumber(formData.mobileNumber)) {
            alert('Mobile number must be numeric and 10 digits long.');
            return;
        }
    
        if (await isEmailDuplicate(formData.email, employee?._id)) {
            alert('Email already exists.');
            return;
        }
    
        const selectedCourses = Object.keys(formData.courses).filter(course => formData.courses[course]);
    
        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('email', formData.email);
        dataToSend.append('mobileNumber', formData.mobileNumber);
        dataToSend.append('designation', formData.designation);
        dataToSend.append('gender', formData.gender);
        selectedCourses.forEach(course => dataToSend.append('courses', course));
        if (formData.image) {
            dataToSend.append('image', formData.image);
        }
    
        try {
            const method = employee ? 'PUT' : 'POST'; // Use PUT for updates
            const url = employee
                ? `http://localhost:5000/api/auth/employees/${employee._id}`
                : "http://localhost:5000/api/auth/employee/register";
    
            const response = await fetch(url, {
                method,
                body: dataToSend,
            });
    
            const contentType = response.headers.get('content-type');
    
            if (!response.ok) {
                const errorData = contentType && contentType.includes('application/json')
                    ? await response.json()
                    : { message: 'Failed to register employee.' };
                throw new Error(`Error ${response.status}: ${errorData.message}`);
            }
    
            const responseData = await response.json();
            console.log("response-> ", responseData);
            alert(employee ? 'Employee updated successfully!' : 'Employee registered successfully!');
            navigate('/employee');
        } catch (error) {
            console.error('Error registering/updating employee:', error);
            alert('Failed to register/update employee. Please try again.');
        }
    };
    
    // Email validation function
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    
    // Numeric validation function
    const validateMobileNumber = (mobileNumber) => {
        const regex = /^[0-9]{10}$/; // Ensuring it is a 10 digit number
        return regex.test(mobileNumber);
    };
    
    // Email duplicate check function
    const isEmailDuplicate = async (email, currentUserId) => {
        const response = await fetch(`http://localhost:5000/api/auth/employees?email=${email}`);
        const employees = await response.json();
        return employees.some(emp => emp.email === email && emp._id !== currentUserId);
    };
    
    // File type validation for image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));
        } else {
            alert('Please upload a valid image (jpg or png)');
        }
    };
    
    

    return (
        <div className="h-screen flex flex-col justify-center items-center" style={{ width: "100%", backgroundColor: "#ffffe3" }}>
            <h1 className='text-6xl font-semibold'>{employee ? 'Edit Employee' : 'Create Employee'}</h1>
            <form onSubmit={handleSubmit} className='text-xl h-5/6 w-2/5 flex flex-col justify-between rounded-2xl px-8 py-5' style={{ backgroundColor: "#D3D3D3" }}>
                <div className='flex justify-between w-4/5'>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className='rounded-md' />
                </div>
                <div className='flex justify-between w-4/5'>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className='rounded-md' />
                </div>
                <div className='flex justify-between w-4/5'>
                    <label>Mobile Number:</label>
                    <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className='rounded-md' />
                </div>
                <div className='flex justify-between w-4/5'>
                    <label>Designation:</label>
                    <select name="designation" value={formData.designation} onChange={handleChange} required className='rounded-md'>
                        <option value="">Select</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div>
                <div className='flex flex-row justify-between w-4/5'>
                    <label>Gender:</label>
                    <div>
                        <label>
                            <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} required /> Male
                        </label>
                        <label>
                            <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} required className='ml-5' /> Female
                        </label>
                    </div>
                </div>
                <div className='flex flex-row justify-between w-4/5'>
                    <label>Course:</label>
                    <div>
                        <label>
                            <input type="checkbox" name="MCA" checked={formData.courses.MCA} onChange={handleChange} /> MCA
                        </label>
                        <label>
                            <input type="checkbox" name="BCA" checked={formData.courses.BCA} onChange={handleChange} className='ml-5' /> BCA
                        </label>
                        <label>
                            <input type="checkbox" name="BSC" checked={formData.courses.BSC} onChange={handleChange} className='ml-5' /> BSC
                        </label>
                    </div>
                </div>
                <div className=''>
                    <label>Upload Image (jpg, png only):</label>
                    <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} className='text-base ml-10' />
                </div>
                <button type="submit" className="mx-auto bg-lime-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-lime-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transition duration-300">
                    {employee ? 'Update User' : 'Create User'}
                </button>
            </form>
        </div>
    );
}

export default CreateUser;
