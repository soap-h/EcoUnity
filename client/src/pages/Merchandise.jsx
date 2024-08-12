import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Box, Typography } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import http from '../http';
import { useCart } from '../contexts/CartContext.jsx';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

import { CustomPrevArrow, CustomNextArrow } from '../components/Arrows.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProductCard from '../components/ProductCard';

function Merchandise() {
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const sliderRef = useRef(null);
    const navigate = useNavigate();
    const cartContext = useCart();
    const dispatch = cartContext?.dispatch || (() => {});
    const [sortOption, setSortOption] = useState('');

    const settings = {
        dots: true,
        infinite: false,
        speed: 250,
        slidesToShow: 4,
        slidesToScroll: 1,
        swipeToSlide: true,
        touchThreshold: 20,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
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

    useEffect(() => {
        http.get("/products")
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch products:', error);
            });
    }, []);

    useEffect(() => {
        if (search) {
            http.get("/products")
                .then(response => {
                    const filtered = response.data.filter(product =>
                        product.prod_name.toLowerCase().includes(search.toLowerCase())
                    );
                    setFilteredProducts(filtered);
                })
                .catch(error => {
                    console.error('Failed to fetch products:', error);
                });
        } else {
            setFilteredProducts([]);
        }
    }, [search]);

    const sortedByNewest = [...products].sort((a, b) => b.id - a.id).slice(0, 10);
    const sortedByRating = [...products].sort((a, b) => b.prod_rating - a.prod_rating).slice(0, 10);

    const handleBuy = (product) => {
        if (product.prod_stock !== 0) {
            dispatch({
                type: 'ADD_TO_CART',
                payload: { id: product.id, name: product.prod_name, price: product.prod_price, image: product.prod_img },
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
        navigate('/purchasehistory');
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const sortedProducts = () => {
        let sorted = [...filteredProducts];

        switch (sortOption) {
            case 'alphabetical':
                sorted.sort((a, b) => a.prod_name.localeCompare(b.prod_name));
                break;
            case 'priceLowToHigh':
                sorted.sort((a, b) => a.prod_price - b.prod_price);
                break;
            case 'priceHighToLow':
                sorted.sort((a, b) => b.prod_price - a.prod_price);
                break;
            default:
                break;
        }

        return sorted;
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '95%', margin: 'auto' }}>
                <IconButton onClick={handleHistory} sx={{ mt: 5, ml: 5, borderRadius: 10 }}>
                    <WorkHistoryIcon sx={{ height: 35, width: 35 }} />
                    <Typography>Purchase History</Typography>
                </IconButton>

                <IconButton onClick={handleCart} sx={{ mt: 5, mr: 5, borderRadius: 10 }}>
                    <ShoppingCartIcon sx={{ height: 35, width: 35 }} />
                    <Typography>Shopping Cart</Typography>
                </IconButton>
            </Box>

            <input type="text" placeholder="Search Products" value={search} onChange={(event) => setSearch(event.target.value)} />
            <select value={sortOption} onChange={handleSortChange}>
                <option value="">Sort By</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
                <option value="priceLowToHigh">Price (Low to High)</option>
                <option value="priceHighToLow">Price (High to Low)</option>
            </select>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, width: '95%', margin: 'auto' }}>
                <Box style={{ width: '90%' }}>
                    {search && (
                        <Box>
                            <h1>Search Results</h1>
                            <Slider ref={sliderRef} {...settings}>
                                {sortedProducts().map((product) => (
                                    <ProductCard key={product.id} product={product} handleBuy={handleBuy} />
                                ))}
                            </Slider>
                        </Box>
                    )}

                    <Box>
                        <h1>New Arrivals</h1>
                        <Slider ref={sliderRef} {...settings}>
                            {sortedByNewest.map((product) => (
                                <ProductCard key={product.id} product={product} handleBuy={handleBuy} />
                            ))}
                        </Slider>
                    </Box>

                    <Box sx={{ mt: 15 }}>
                        <h1>Highest Rated</h1>
                        <Slider ref={sliderRef} {...settings}>
                            {sortedByRating.map((product) => (
                                <ProductCard key={product.id} product={product} handleBuy={handleBuy} />
                            ))}
                        </Slider>
                    </Box>
                </Box>
            </Box>

            <ToastContainer />
        </>
    );
}

export default Merchandise;
