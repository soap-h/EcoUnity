import React, { useContext } from 'react';
import UserContext from '../contexts/UserContext';

const DebugAdminCheck = () => {
    const { user } = useContext(UserContext);

    return (
        <div>
            <p>User isAdmin: {user?.isAdmin}</p>
            <p>User JSON: {JSON.stringify(user)}</p>
        </div>
    );
};

export default DebugAdminCheck;
