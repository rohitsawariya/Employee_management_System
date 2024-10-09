import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Store/storeContext';

function Login() {
  const {setUsername, setIsLoggedin } = useContext(AuthContext);
  const [cred, setCred] = useState({ username: "", password: "" });
  let navigate = useNavigate();

  const onChange = (event) => {
    setCred({ ...cred, [event.target.name]: event.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // this api for registering New users - http://localhost:5000/api/auth/register
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: cred.username,
        password: cred.password
      })
    });

    const json = await response.json();
    console.log(json);

    // Check for success response and handle it
    if (response.ok) { // Check if the response status is 200-299
      localStorage.setItem("userName", cred.username); 
      localStorage.setItem("authToken", json.token); // Store the auth token if returned
      setIsLoggedin(true);
      setUsername(cred.username);
      navigate("/dashboard"); // Navigate to dashboard
    } else {
      alert(json.msg || "Enter Valid Credentials"); // Show error message
    }
  }

  return (
    <div className="container h-screen flex justify-center items-center" style={{ width: "100%", backgroundColor: "#ffffe3" }}>
      <div className="child h-3/4 flex items-center rounded-2xl flex-col border-solid border-2 border-danger-500" style={{ width: "27rem", backgroundColor: "rgb(206 206 225)" }}>
        <h1 className="text-6xl mt-4">Login</h1>
        <hr style={{ height: '2px', backgroundColor: 'grey', border: 'none', margin: '20px 0', width: '90%' }} />
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-center w-4/5 h-screen">
          <label htmlFor="username" className="text-3xl">User Name</label>
          <hr style={{ height: '1px', backgroundColor: 'grey', border: 'none', width: '35%' }} />
          <input
            type="text"
            className="username px-3 text-xl w-3/4 mt-6 rounded-lg h-8"
            id="username"
            value={cred.username}
            onChange={onChange}
            name="username"
          />
          <label htmlFor="password" className="text-3xl mt-10">Password</label>
          <hr style={{ height: '1px', backgroundColor: 'grey', width: '35%' }} />
          <input
            type="password"
            className="password px-3 h-8 text-xl rounded-lg w-3/4 mt-6"
            id="password"
            value={cred.password}
            onChange={onChange}
            name="password"
          />
          <button
            type="submit"
            className="mt-16 bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transition duration-200 w-28 text-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
