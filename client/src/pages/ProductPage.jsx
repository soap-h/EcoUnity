import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, Grid, Rating, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import http from '../http'; // Adjust the path to your http utility
import LocalShippingIcon from '@mui/icons-material/LocalShipping';


function ProductPage( ) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/reviews/${product.id}`)
    };
    
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await http.get(`/products/${id}`);
                setProduct(response.data);

                const reviewsResponse = await http.get(`/reviews/${id}`);
                console.log(reviewsResponse.data);
                setReviews(reviewsResponse.data);


                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch product:', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    const reviewCount = reviews.length
    
    return (
        <PageContainer>
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <ImageGallery>
                    <MainImage src={`${import.meta.env.VITE_FILE_PRODUCTS_URL}/${product.prod_img}`} alt={product.prod_name} />
                    <ThumbnailContainer>
                        {[...Array(4)].map((_, index) => (
                            <Thumbnail key={index} src={`${import.meta.env.VITE_FILE_PRODUCTS_URL}/${product.prod_img}`} alt={`Thumbnail ${index}`} />
                        ))}
                    </ThumbnailContainer>
                </ImageGallery>
            </Grid>
            <Grid item xs={12} md={6}>
                <ProductDetails>
                    <ProductName variant="h4">{product.prod_name}</ProductName>
                    <RatingContainer>
                        <Rating value={product.prod_rating} readOnly precision={0.25} />
                        <ReviewCount>({reviewCount} reviews)</ReviewCount>
                        <ReviewLink onClick={handleClick}>View Reviews</ReviewLink>
                    </RatingContainer>
                    <ProductPrice variant="h5">{product.prod_price} Points</ProductPrice>
                    <ShippingInfo>
                        <LocalShippingIcon />
                        1-2 days
                    </ShippingInfo>
                    <ProductDescription>{product.prod_desc}</ProductDescription>
                    <ProductSpecs>
                        <SpecItem>Weight: 1 kilogram</SpecItem>
                        <SpecItem>Size: 500mm x 70mm x 70mm</SpecItem>
                    </ProductSpecs>
                    <ButtonContainer>
                        <AddToCartButton variant="contained">Add to Cart</AddToCartButton>
                        <BuyNowButton variant="contained">Buy Now</BuyNowButton>
                    </ButtonContainer>
                </ProductDetails>
            </Grid>
        </Grid>
    </PageContainer>
    );
}

const PageContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    maxWidth: '1200px',
    margin: 'auto',
}));

const ImageGallery = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const MainImage = styled('img')(({ theme }) => ({
    width: '100%',
    maxWidth: '400px',
    height: 'auto',
    borderRadius: theme.shape.borderRadius,
}));

const ThumbnailContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
}));

const Thumbnail = styled('img')(({ theme }) => ({
    width: '60px',
    height: '60px',
    marginRight: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    '&:last-child': {
        marginRight: 0,
    },
}));

const ProductDetails = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
}));

const ProductName = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
}));

const RatingContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const ReviewCount = styled(Typography)(({ theme }) => ({
    marginLeft: theme.spacing(1),
}));

const ReviewLink = styled(Typography)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    color: 'blue',
    cursor: 'pointer',
}));

const ProductPrice = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: theme.spacing(2),
}));

const ShippingInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));


const ProductDescription = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

const ProductSpecs = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

const SpecItem = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

const AddToCartButton = styled(Button)(({ theme }) => ({
    marginRight: theme.spacing(2),
    backgroundColor: 'blue',
    '&:hover': {
        backgroundColor: 'darkblue',
    },
}));

const BuyNowButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'blue',
    '&:hover': {
        backgroundColor: 'darkblue',
    },
}));

export default ProductPage;