import React from 'react';
import { IconButton } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

const CustomPrevArrow = ({ className, style, onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        left: '-3rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2,
        display: className.includes('slick-disabled') ? 'none' : 'block', // Hide if disabled
      }}
      disabled={className.includes('slick-disabled')}
    >
      <ArrowCircleLeftIcon sx={{ height: '40px', width: '40px' }} />
    </IconButton>
  );
};

const CustomNextArrow = ({ className, style, onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        right: '-3rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2,
        display: className.includes('slick-disabled') ? 'none' : 'block', // Hide if disabled
      }}
      disabled={className.includes('slick-disabled')}
    >
      <ArrowCircleRightIcon sx={{ height: '40px', width: '40px' }} />
    </IconButton>
  );
};

export { CustomPrevArrow, CustomNextArrow };
