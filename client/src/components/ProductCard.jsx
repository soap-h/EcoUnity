import React, { useState } from 'react';
import { Box, Typography, Button, Rating } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product, handleBuy }) {
    const navigate = useNavigate();
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (event) => {
        setStartPosition({ x: event.clientX, y: event.clientY });
        setIsDragging(false);
    };

    const handleMouseMove = (event) => {
        const deltaX = Math.abs(event.clientX - startPosition.x);
        const deltaY = Math.abs(event.clientY - startPosition.y);
        if (deltaX > 5 || deltaY > 5) {
            setIsDragging(true);
        }
    };

    const handleMouseUp = (event) => {
        const endPosition = { x: event.clientX, y: event.clientY };
        const deltaX = Math.abs(endPosition.x - startPosition.x);
        const deltaY = Math.abs(endPosition.y - startPosition.y);

        // Navigate only if the mouse didn't drag significantly
        if (!isDragging && deltaX < 5 && deltaY < 5) {
            navigate(`/products/${product.id}`);
        }
    };

    return (
        <CardContainer key={product.id}>
            <ProductImageContainer
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <ProductImage
                    src={`${import.meta.env.VITE_FILE_PRODUCTS_URL}/${product.prod_img}`}
                    alt={product.prod_name}
                />
            </ProductImageContainer>
            <ProductDetails>
                <ProductName variant="h6" onClick={handleMouseUp}>
                    {product.prod_name}
                </ProductName>
                <ReviewContainer>
                    {product.prod_rating > 0 ? (
                        <ProductRating variant="body2">
                            <Rating
                                value={product.prod_rating}
                                readOnly
                                precision={0.25}  // This allows for half-star ratings
                            />
                        </ProductRating>
                    ) : (
                        <NoReviews variant="body2">No reviews yet</NoReviews>
                    )}
                </ReviewContainer>
                
                <ProductPrice variant="body2">{product.prod_price} points</ProductPrice>
                <ProductSold variant="body2">{product.prod_sold} sold</ProductSold>
                {product.prod_stock > 0 ? (
                    <ProductStock variant="body1">{product.prod_stock} left in stock</ProductStock>
                ) : (
                    <OutOfStock variant="body1">OUT OF STOCK</OutOfStock>
                )}
                <BuyButton variant="contained" onClick={() => handleBuy(product)}>
                    Add to Cart
                </BuyButton>
            </ProductDetails>
        </CardContainer>
    );
}

const CardContainer = styled(Box)(({ theme }) => ({
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    margin: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#fff',
    height: '100%',
}));

const ReviewContainer = styled(Box)(({ theme }) => ({
    maxHeight: '18px', // Ensure the same height as the star rating
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));


const ProductImageContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    paddingTop: '100%', // 1:1 aspect ratio
    position: 'relative',
    marginBottom: '10px',
    cursor: 'pointer',
}));

const ProductImage = styled('img')(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover', // or 'fill' to stretch and squeeze
    borderRadius: '8px',
}));

const ProductDetails = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const ProductName = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    marginBottom: '8px',
    cursor: 'pointer',
}));

const ProductRating = styled(Typography)(({ theme }) => ({
    color: '#ff9800',
    marginBottom: '0px',
}));

const NoReviews = styled(Typography)(({ theme }) => ({
    color: '#888',
    marginBottom: '0px',
}));

const ProductSold = styled(Typography)(({ theme }) => ({
    color: '#00000',
    marginBottom: '8px',
}));


const ProductPrice = styled(Typography)(({ theme }) => ({
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: '8px',
}));

const ProductStock = styled(Typography)(({ theme }) => ({
    color: '#4caf50',
    marginBottom: '16px',
}));

const OutOfStock = styled(Typography)(({ theme }) => ({
    color: '#f44336',
    marginBottom: '16px',
}));

const BuyButton = styled(Button)(({ theme }) => ({
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#075F6B',
    color: 'white',
    '&:hover': {
        backgroundColor: '#064d56',
    },
}));

export default ProductCard;
