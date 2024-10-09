import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/employees');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEmployees(data);
        console.log("employeeData-> ", data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployees();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    return formattedDate.replace(/(\d{2}) (\w{3}) (\d{2})/, '$1-$2-$3');
  };

  const handleEdit = (employee) => {
    console.log("Edit button clicked", employee);
    navigate('/createUser', { state: { employee } });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/employees/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  return (
    <>
<Header/>
    <div className="h-screen flex flex-col items-center mt-4">
      <h1 className="text-4xl font-bold mb-5">Employee List</h1>
      {employees.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Unique Id</th>
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Mobile</th>
              <th className="border border-gray-300 p-2">Designation</th>
              <th className="border border-gray-300 p-2">Gender</th>
              <th className="border border-gray-300 p-2">Courses</th>
              <th className="border border-gray-300 p-2">Create Date</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="border border-gray-300 p-2">{employee._id}</td>
                <td className="border border-gray-300 p-2">
                  {employee.image ? (
                    <img src={employee.image} alt="Employee" className="w-16 h-16 object-cover" />
                  ) : <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" className="w-16 h-16 object-cover" alt="No Image"/>}
                </td>
                <td className="border border-gray-300 p-2">{employee.name}</td>
                <td className="border border-gray-300 p-2">{employee.email}</td>
                <td className="border border-gray-300 p-2">{employee.mobileNumber}</td>
                <td className="border border-gray-300 p-2">{employee.designation}</td>
                <td className="border border-gray-300 p-2">{employee.gender}</td>
                <td className="border border-gray-300 p-2">
                  {employee.courses.length > 0 ? employee.courses.join(', ') : 'No Courses'}
                </td>
                <td className="border border-gray-300 p-2">
                  {employee.date ? formatDate(employee.date) : 'N/A'}
                </td>
                <td className='w-56 mt-6 flex flex-row justify-evenly text-xl'>
                  <button onClick={() => handleEdit(employee)}>Edit</button>
                  <button onClick={() => handleDelete(employee._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employees found</p>
      )}
    </div>
    </>
  );
}

export default Employees;
