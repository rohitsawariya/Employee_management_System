import React, { useContext } from 'react'; 
import { CgProfile } from "react-icons/cg";
import { AuthContext } from '../Store/storeContext';
import { useNavigate } from 'react-router-dom';

function Header({ handleClick }) {
    const { username, setIsLoggedin } = useContext(AuthContext);
    const navigate = useNavigate();

    const newUser = () => {
        navigate("/createUser");
    }

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName"); 
        setIsLoggedin(false); 
        navigate("/");
    };

    return (
        <div className="head h-16 w-screen rounded-2xl" style={{ backgroundColor: "#EDEADE" }}>
            <ul className='flex flex-row justify-around items-center text-xl'>
                <li onClick={() => navigate("/dashboard")}>Home</li>
                <li onClick={handleClick}>Employee List</li>
                <li className='flex'>
                    {username}
                    <CgProfile size={32} className='ml-2' />
                </li>
                <li className='flex flex-row justify-between w-72'>
                    <button
                        type="button"
                        className="bg-orange-400 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transition duration-200 w-36 text-lg"
                        onClick={newUser}
                    >
                        Create User
                    </button> 
                    <button
                        type="button"
                        className="bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transition duration-200 w-28 text-lg"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Header;
