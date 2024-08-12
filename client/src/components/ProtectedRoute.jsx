import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const { user } = useContext(UserContext);

    console.log('user.isAdmin:', user?.isAdmin); // Add this line

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.isAdmin == false) {
        return <Navigate to="/" />;
    }

    return <Component {...rest} />;
};

export default ProtectedRoute;
