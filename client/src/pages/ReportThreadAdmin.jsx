import React, {useContext} from 'react';
import { Box } from '@mui/material';
import AdminSidebar from '../components/AdminSidebar';
import UserContext from '../contexts/UserContext';

function ReportThreadAdmin() {
    const user =  useContext(UserContext);
    return (
        <Box sx={{ display: "flex" }}>
            <AdminSidebar username={user?.firstName || 'User'} />

            
        </Box>
    )
}

export default ReportThreadAdmin