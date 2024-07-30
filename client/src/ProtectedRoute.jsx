// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import UserContext from './contexts/UserContext';

// const ProtectedRoute = ({ element: Component, admin, ...rest }) => {
//   const { user } = useContext(UserContext);

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   if (admin && !user.isAdmin) {
//     return <Navigate to="/" />;
//   }

//   return <Component {...rest} />;
// };

// export default ProtectedRoute;
