import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

function ProductCard( {product, handleBuy} ) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/products/${product.id}`);
    };
    

    return (
        <CardContainer key={product.id}>
            <ProductImageContainer onClick={handleNavigate}>
                <ProductImage src={`${import.meta.env.VITE_FILE_BASE_URL}/${product.prod_img}`} alt={product.prod_name} />
            </ProductImageContainer>
            <ProductDetails>
                <ProductName variant="h6" onClick={handleNavigate}>{product.prod_name}</ProductName>
                {product.prod_rating > 0 ? (
                    <ProductRating variant="body2">{product.prod_rating} / 5</ProductRating>
                ) : (
                    <NoReviews variant="body2">No reviews yet</NoReviews>
                )}
                <ProductPrice variant="body1">{product.prod_price} points</ProductPrice>
                {product.prod_stock > 0 ? (
                    <ProductStock variant="body2">{product.prod_stock} left in stock</ProductStock>
                ) : (
                    <OutOfStock variant="body2">OUT OF STOCK</OutOfStock>
                )}
                <BuyButton variant="contained" onClick={() => handleBuy(product)}>
                    Add to Cart
                </BuyButton>
            </ProductDetails>
        </CardContainer>
    );
};

const CardContainer = styled(Box)(({ theme }) => ({
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    margin: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#fff',
}));

const ProductImageContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    paddingTop: '100%', // 1:1 aspect ratio
    position: 'relative',
    marginBottom: '10px',
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
}));

const ProductRating = styled(Typography)(({ theme }) => ({
    color: '#ff9800',
    marginBottom: '8px',
}));

const NoReviews = styled(Typography)(({ theme }) => ({
    color: '#888',
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
