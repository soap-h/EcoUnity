import React, { useState, useEffect, useRef } from 'react';
import { Button, IconButton, Box, Typography } from '@mui/material';
import MerchandiseBanner from '../assets/Merchandise Banner.png'; // Ensure path is correct
import Slider from 'react-slick'; // Import the Slider component from react-slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import http from '../http';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

function Merchandise() {
    const [products, setProducts] = useState([]);
    const sliderRef = useRef(null);

    const settings = {
        dots: true,
        infinite: false,
        speed: 250,
        slidesToShow: 4,
        slidesToScroll: 1,
        swipeToSlide: true,
        touchThreshold: 20,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const handleNext = () => {
        sliderRef.current.slickNext();
    };

    const handlePrev = () => {
        sliderRef.current.slickPrev();
    };

    const handleBuy = (product) => {
        
    }

    useEffect(() => {
        http.get("/products")
            .then(response => {
                setProducts(response.data); // Set fetched products to state
            })
            .catch(error => {
                console.error('Failed to fetch products:', error);
            });
    }, []); // Dependency array includes endpoint to refetch if any endpoint changes

    return (
        <>
            {/* <img src={MerchandiseBanner} alt="Merchandise Banner" style={{ width: '100%', marginBottom: '20px' }} /> */}
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, width: '95%', margin: 'auto' }}>
                <IconButton variant="contained" onClick={handlePrev} sx={{ mr: 2 }}>                       
                    <ArrowCircleLeftIcon sx={{height: '50px', width: '50px'}} />
                </IconButton>

                <Box style={{ width: '90%' }}>
                    {/* New Products Carousel */}
                    <h1>New Arrivals</h1>
                    <Slider ref={sliderRef} {...settings}>
                        {products.map((product, index) => (
                            <div key={index} style={{ padding: '0 10px' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img src={`${import.meta.env.VITE_FILE_BASE_URL}/${product.prod_img}`} alt={`Product ${index}`} width={200} height={200} />
                                    <h3>{product.prod_name}</h3>
                                    { product.prod_rating > 0 ? <h4>{product.prod_rating} / 5</h4> : <h4>No reviews yet</h4>}
                                    <h4>{product.prod_price} points</h4>
                                    { product.prod_stock > 0 ? <h4>{product.prod_stock} left in stock</h4> : <h4>OUT OF STOCK</h4>}
                                    <Button onClick={() => handleBuy(product)} color="inherit" sx={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 600, backgroundColor: '#075F6B', color: 'white' }}> 
                                        Buy Now
                                    </Button>
                                </Box>
                            </div>
                        ))}
                    </Slider>
                </Box>

                <IconButton variant="contained" onClick={handleNext}>
                    <ArrowCircleRightIcon sx={{height: '50px', width: '50px'}} />
                </IconButton>
            </Box>
        </>
    );
}

export default Merchandise;
