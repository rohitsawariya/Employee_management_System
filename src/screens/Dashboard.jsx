import React from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
  
    const handleClick = () => {
        navigate('/employee');
        console.log("employee");
        
    };
  return (
    
    <div className='h-screen w-screen'  style={{backgroundColor: "rgb(245 245 220 / 51%)"}}>
    <Header handleClick={handleClick}></Header>
    <h1 className='dash'>Welcome, Admin Panel</h1>
    </div>
  )
}

export default Dashboard