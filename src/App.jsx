import { useContext } from 'react';
import './App.css';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Employee from './screens/Employee';
import { AuthProvider, AuthContext } from './Store/storeContext'; 
import CreateUser from './screens/CreateUser';

function App() {
  const { isLoggedin } = useContext(AuthContext);  
  console.log(isLoggedin, "logged in status");

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isLoggedin ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={isLoggedin ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/employee" element={isLoggedin ? <Employee /> : <Navigate to="/" />} />
          <Route path="/createUser" element={isLoggedin ? <CreateUser /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      // <Employee/>
      // <CreateUser/>
  );
}

export default App;
