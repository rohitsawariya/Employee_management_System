import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [username, setUsername] = useState("");

    return (
        <AuthContext.Provider value={{isLoggedin, setIsLoggedin, username, setUsername }}>
        {children}
    </AuthContext.Provider>
    );
};
