import React from 'react';
import { Box } from '@mui/material';
import ForumPicture from '../../assets/discussion.jpg';



function ForumBigPicture() {
  return (
    <Box width={"100%"} display={'flex'} justifyContent={'center'} alignItems={'center'}>
    <img src={ForumPicture} style={{ width: "100%", height: "auto", maxHeight: '500px' }} alt="Forum"></img>
    </Box>
  )
}

export default ForumBigPicture;