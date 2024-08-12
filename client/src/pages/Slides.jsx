import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

function Slides({ slidesPath }) {
  const [pdfUrl, setPdfUrl] = useState('');
  
  useEffect(() => {
    if (slidesPath) {
      setPdfUrl(`${import.meta.env.VITE_FILE_SLIDES_URL}/${slidesPath}`);
    }
  }, [slidesPath]); // Runs the effect whenever slidePath changes
  console.log("pdfUrl", pdfUrl);
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Slides
      </Typography>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          style={{ border: 'none' }}
          title="Lesson Slides"
        />
      ) : (
        <Typography>Loading slides...</Typography>
      )}
    </Box>
  );
}

export default Slides;
