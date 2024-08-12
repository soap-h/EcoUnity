import React from 'react';
import { Popover, Box, Typography } from '@mui/material';

const CategoryPopup = ({ anchorEl, handleClose, categoryName, categoryDescription, threadCount, picture }) => {
    const open = Boolean(anchorEl);

    // Helper function to close the popover when mouse leaves
    const handlePopoverMouseLeave = (event) => {
        if (!anchorEl || !anchorEl.contains(event.relatedTarget)) {
            handleClose();
        }
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            onMouseLeave={handlePopoverMouseLeave} // Add mouse leave handler
        >
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    padding: 2,
                    maxWidth: '300px', // Set a max width for the popover
                    bgcolor: 'background.paper', // Background color
                    borderRadius: 2, // Rounded corners
                    boxShadow: 3, // Shadow for elevation
                }}
                onMouseLeave={handlePopoverMouseLeave} // Ensure to handle on the Box itself
            >
                <Box 
                    component="img" 
                    src={picture} 
                    alt={categoryName} 
                    sx={{
                        width: '100%', // Make image responsive
                        height: 'auto',
                        aspectRatio: '16 / 9', // Maintain 16:9 aspect ratio
                        borderRadius: '8px',
                        objectFit: 'cover', // Cover the box without stretching
                        marginBottom: 2,
                    }} 
                />
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    {categoryName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', marginBottom: 1 }}>
                    {categoryDescription}
                </Typography>
                <Typography variant="body2" color="text.primary">
                    Number of threads in this category: {threadCount}
                </Typography>
            </Box>
        </Popover>
    );
};

export default CategoryPopup;
