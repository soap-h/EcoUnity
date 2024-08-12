import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, Box, Typography } from '@mui/material';
import MerchandiseBanner from '../assets/Merchandise Banner.png'; // Ensure path is correct
import Slider from 'react-slick'; // Import the Slider component from react-slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import http from '../http';
import { useCart } from '../contexts/CartContext.jsx';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

import { CustomPrevArrow, CustomNextArrow } from '../components/Arrows.jsx';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import ProductCard from '../components/ProductCard';

function Merchandise() {
    const [products, setProducts] = useState([]);
    const sliderRef = useRef(null);
    const navigate = useNavigate();
    const cartContext = useCart();
    const dispatch = cartContext?.dispatch || (() => {});


    const settings = {
        dots: true,
        infinite: false,
        speed: 250,
        slidesToShow: 4,
        slidesToScroll: 1,
        swipeToSlide: true,
        touchThreshold: 20,
        prevArrow: <CustomPrevArrow/>,
        nextArrow: <CustomNextArrow/>,
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
        console.log('Adding to cart:', product);
        if (product.prod_stock !== 0) {
            dispatch({
                type: 'ADD_TO_CART',
                payload: {id: product.id, name: product.prod_name, price: product.prod_price, image: product.prod_img},
            });
            toast.success('Product added to cart!');
        } else {
            toast.error('Product is out of stock!');
        }
    };
    

    const handleCart = () => {
        navigate('/cart');
    };

    const handleHistory = () => {
        navigate('/purchasehistory')
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

    const sortedByNewest = [...products].sort((a, b) => b.id - a.id).slice(0, 10);
    const sortedByRating = [...products].sort((a, b) => b.prod_rating - a.prod_rating).slice(0, 10);
    console.log(sortedByRating)

    return (
        <>
            {/* <img src={MerchandiseBanner} alt="Merchandise Banner" style={{ width: '100%', marginBottom: '20px' }} /> */}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '95%', margin: 'auto'}}>
                <IconButton onClick={handleHistory} sx={{ mt: 5, ml: 5, borderRadius: 10 }}>
                    <WorkHistoryIcon sx={{ height: 35, width: 35 }} />
                    <Typography>Purchase History</Typography>
                </IconButton>

                <IconButton onClick={handleCart} sx={{ mt: 5, mr: 5, borderRadius: 10 }}>
                    <ShoppingCartIcon sx={{ height: 35, width: 35 }} />
                    <Typography>Shopping Cart</Typography>
                </IconButton>
            </Box>
            

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, width: '95%', margin: 'auto' }}>
                {/* <IconButton variant="contained" onClick={handlePrev} sx={{ mr: 2 }}>                       
                    <ArrowCircleLeftIcon sx={{height: '50px', width: '50px'}} />
                </IconButton> */}

                <Box style={{ width: '90%' }}>
                    {/* New Products Carousel */}
                    <Box>
                        <h1>New Arrivals</h1>
                        <Slider ref={sliderRef} {...settings}>
                            {sortedByNewest.map((product) => (
                                <ProductCard key={product.id} product={product} handleBuy={handleBuy} />
                            ))}
                        </Slider>
                    </Box>
                  
                    <Box sx={{mt: 15}}>
                        <h1>Highest Rated</h1>
                        <Slider ref={sliderRef} {...settings}>
                            {sortedByRating.map((product) => (
                                <ProductCard key={product.id} product={product} handleBuy={handleBuy} />
                            ))}
                        </Slider>
                    </Box>        
                 

                </Box>

                {/* <IconButton variant="contained" onClick={handleNext}>
                    <ArrowCircleRightIcon sx={{height: '50px', width: '50px'}} />
                </IconButton> */}

                <ToastContainer/>
            </Box>
        </>
    );
}

export default Merchandise;
